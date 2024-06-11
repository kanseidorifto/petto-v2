/* eslint-disable no-mixed-spaces-and-tabs */
import { baseApi } from './baseService';

export const postApi = baseApi.injectEndpoints({
	reducerPath: 'postApi',
	endpoints: (builder) => ({
		getAllPostList: builder.query({
			query: () => ({
				url: `/userpost`,
				method: 'GET',
			}),
			providesTags: (result) =>
				// is result available?
				result?.items
					? // successful query
					  [
							...result.items.map(({ id }) => ({ type: 'Posts', id: id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getMyFeedPostList: builder.query({
			query: () => ({
				url: `/userpost/feed`,
				method: 'GET',
			}),
			providesTags: (result) =>
				// is result available?
				result?.items
					? // successful query
					  [
							...result.items.map(({ id }) => ({ type: 'Posts', id: id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getUserPostList: builder.query({
			query: (profileId) => ({
				url: `/userpost`,
				method: 'GET',
				params: { profileId },
			}),
			providesTags: (result) =>
				// is result available?
				result?.items
					? // successful query
					  [
							...result.items.map(({ id }) => ({ type: 'Posts', id: id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getPetPostList: builder.query({
			query: (petProfileId) => ({
				url: `/userpost`,
				method: 'GET',
				params: { petProfileId },
			}),
			providesTags: (result) =>
				// is result available?
				result?.items
					? // successful query
					  [
							...result.items.map(({ id }) => ({ type: 'Posts', id: id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		createUserPost: builder.mutation({
			query: (data) => ({
				url: `/userpost`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
		removeUserPost: builder.mutation({
			query: (postId) => ({
				url: `/userpost/${postId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Posts', id: result.id },
				{ type: 'Posts', id: 'LIST' },
			],
		}),
		sendPostLike: builder.mutation({
			query: (postId) => ({
				url: `/userpost/${postId}/like`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
		cancelPostLike: builder.mutation({
			query: (postId) => ({
				url: `/userpost/${postId}/like`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
		sendPostComment: builder.mutation({
			query: ({ postId, writtenText }) => ({
				url: `/userpost/${postId}/comment`,
				method: 'POST',
				body: { writtenText },
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
		removePostComment: builder.mutation({
			query: (commentId) => ({
				url: `/userpost/comment/${commentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllPostListQuery,
	useGetMyFeedPostListQuery,
	useGetUserPostListQuery,
	useGetPetPostListQuery,
	useCreateUserPostMutation,
	useRemoveUserPostMutation,
	useSendPostLikeMutation,
	useCancelPostLikeMutation,
	useSendPostCommentMutation,
	useRemovePostCommentMutation,
} = postApi;
