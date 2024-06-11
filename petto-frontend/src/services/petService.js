/* eslint-disable no-mixed-spaces-and-tabs */
import { baseApi } from './baseService';

export const petApi = baseApi.injectEndpoints({
	reducerPath: 'petApi',
	endpoints: (builder) => ({
		getMyPetList: builder.query({
			query: () => ({
				url: `/petprofile/me`,
				method: 'GET',
			}),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({ type: 'Pets', id: 'pet-' + id })),
							{ type: 'Pets', id: 'LIST' },
					  ]
					: [{ type: 'Pets', id: 'LIST' }],
		}),
		getUserPetList: builder.query({
			query: (ownerId) => ({
				url: `/petprofile`,
				method: 'GET',
				params: { ownerId },
			}),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({ type: 'Pets', id: 'pet-' + id })),
							{ type: 'Pets', id: 'LIST' },
					  ]
					: [{ type: 'Pets', id: 'LIST' }],
		}),
		getPet: builder.query({
			query: (petId) => ({
				url: `/petprofile/${petId}`,
				method: 'GET',
			}),

			providesTags: (result) => [{ type: 'Pets', id: 'pet-' + result.id }],
		}),
		createPet: builder.mutation({
			query: (data) => ({
				url: `/petprofile`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Pets', id: 'LIST' }],
		}),
		updatePet: builder.mutation({
			query: ({ petId, data }) => ({
				url: `/petprofile/${petId}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: (result) => [{ type: 'Pets', id: 'pet-' + result.id }],
		}),
		removePet: builder.mutation({
			query: (petId) => ({
				url: `/petprofile/${petId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => [
				{ type: 'Pets', id: 'pet-' + result.id },
				{ type: 'Pets', id: 'LIST' },
			],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetMyPetListQuery,
	useGetUserPetListQuery,
	useGetPetQuery,
	useCreatePetMutation,
	useUpdatePetMutation,
	useRemovePetMutation,
} = petApi;
