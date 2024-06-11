/* eslint-disable no-mixed-spaces-and-tabs */
import { baseApi } from './baseService';

export const authApi = baseApi.injectEndpoints({
	reducerPath: 'authApi',
	endpoints: (builder) => ({
		getOwnerDetails: builder.query({
			query: () => ({
				url: '/user/me',
				method: 'GET',
			}),
			providesTags: (result) =>
				result
					? [
							{ type: 'Auth', id: 'user-' + result.id },
							{ type: 'Auth', id: 'userProfileDetails' },
					  ]
					: [{ type: 'Auth', id: 'userProfileDetails' }],
		}),
		getUserDetails: builder.query({
			query: (id) => ({
				url: `/user/${id}`,
				method: 'GET',
			}),
			providesTags: (result) => [{ type: 'Auth', id: 'user-' + result.id }],
		}),
		searchUser: builder.query({
			query: (search) => ({
				url: `/user`,
				method: 'GET',
				params: {
					search,
				},
			}),
			providesTags: () => [{ type: 'Auth', id: 'SEARCH' }],
		}),
		updateOwnerDetails: builder.mutation({
			query: (details) => ({
				url: `/user/me`,
				method: 'PUT',
				body: details,
			}),
			invalidatesTags: (result) => [
				{ type: 'Auth', id: 'user-' + result.id },
				{ type: 'Auth', id: 'userProfileDetails' },
			],
		}),
		getFriendList: builder.query({
			query: () => ({
				url: `/userfriendship`,
				method: 'GET',
			}),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({ type: 'Friends', id: 'friendRequest-' + id })),
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		getFriendRequestList: builder.query({
			query: (direction) => ({
				url: `/userfriendship/requests`,
				method: 'GET',
				params: { direction },
			}),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({ type: 'Friends', id: 'friendRequest-' + id })),
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		sendFriendRequest: builder.mutation({
			query: (userId) => ({
				url: `/userfriendship/requests`,
				method: 'POST',
				params: {
					profileAcceptId: userId,
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Friends', id: 'friendRequest-' + result.id },
							{ type: 'Friends', id: 'LIST' },
							{ type: 'Posts', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		acceptFriendRequest: builder.mutation({
			query: (userid) => ({
				url: `/userfriendship/requests`,
				method: 'PATCH',
				params: {
					profileRequestId: userid,
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Friends', id: 'friendRequest-' + result.id },
							{ type: 'Friends', id: 'LIST' },
							{ type: 'Posts', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		cancelFriendRequest: builder.mutation({
			query: (userId) => ({
				url: `/userfriendship/requests`,
				method: 'DELETE',
				params: {
					profileId: userId,
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Friends', id: 'friendRequest-' + result.id },
							{ type: 'Friends', id: 'LIST' },
							{ type: 'Posts', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetOwnerDetailsQuery,
	useGetUserDetailsQuery,
	useLazySearchUserQuery,
	useUpdateOwnerDetailsMutation,
	useGetFriendListQuery,
	useLazyGetFriendRequestListQuery,
	useSendFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useCancelFriendRequestMutation,
} = authApi;
