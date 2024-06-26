/* eslint-disable no-mixed-spaces-and-tabs */
import { baseApi } from './baseService';

export const chatApi = baseApi.injectEndpoints({
	reducerPath: 'chatApi',
	endpoints: (builder) => ({
		getChatList: builder.query({
			query: ({ search }) => ({
				url: `/chat`,
				method: 'GET',
				params: { search },
			}),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({ type: 'Chats', id: id })),
							{ type: 'Chats', id: 'LIST' },
					  ]
					: [{ type: 'Chats', id: 'LIST' }],
		}),
		getChat: builder.query({
			query: (chatId) => ({
				url: `/chat/${chatId}`,
				method: 'GET',
			}),
			providesTags: (result, error, chatId) => [{ type: 'Chats', id: chatId }],
		}),
		removeChat: builder.mutation({
			query: (chatId) => ({
				url: `/chat/${chatId}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Chats', id: 'LIST' }],
		}),
		getChatMessageList: builder.query({
			query: ({ chatId, query }) => ({
				url: `/chat/${chatId}/messages`,
				method: 'GET',
				params: query,
			}),
			providesTags: (result, error, chatId) => {
				return result?.items
					? [
							...result.items.map(({ id }) => ({ type: 'Messages', id: id })),
							{ type: 'Messages', id: `chat-${chatId}-LIST` },
					  ]
					: [{ type: 'Messages', id: `chat-${chatId}-LIST` }];
			},
			// Only have one cache entry because the arg always maps to one string
			serializeQueryArgs: ({ queryArgs }) => {
				return queryArgs.chatId;
			},
			// Always merge incoming data to the cache entry
			merge: (currentCache, newData) => {
				currentCache.items.push(...newData.items);
				currentCache.totalCount = newData.totalCount;
			},
			// Refetch when the page arg changes
			forceRefetch({ currentArg, previousArg }) {
				if (!previousArg) return true;
				return currentArg.query.pageNumber > previousArg?.query.pageNumber;
			},
		}),
		sendMessage: builder.mutation({
			query: ({ chatId, message }) => ({
				url: `/chat/${chatId}/messages`,
				method: 'POST',
				body: message,
			}),
			invalidatesTags: (result, error, { chatId }) => [
				// { type: 'Messages', id: `chat-${chatId}-LIST` },
				{ type: 'Chats', id: chatId },
				{ type: 'Chats', id: 'LIST' },
			],
			// async onQueryStarted({ chatId, message }, { dispatch, queryFulfilled }) {
			// 	try {
			// 		const { data: createdMessage } = await queryFulfilled;
			// 		const patchResult = dispatch(
			// 			baseApi.util.updateQueryData('getChatMessageList', { chatId }, (messageList) => ({
			// 				items: [createdMessage, ...messageList.items],
			// 				totalCount: messageList.totalCount + 1,
			// 			})),
			// 		);
			// 	} catch {
			// 		// Handle error
			// 	}
			// },
		}),
		sendPrivateMessage: builder.mutation({
			query: ({ userId, message }) => ({
				url: `/chat/private/${userId}/messages`,
				method: 'POST',
				body: message,
			}),
			invalidatesTags: (result) => [
				// { type: 'Messages', id: `chat-${chatId}-LIST` },
				{ type: 'Chats', id: result.chatRoomId },
				{ type: 'Chats', id: 'LIST' },
			],
		}),
		markMessageAsRead: builder.mutation({
			query: ({ messageId }) => ({
				url: `/chat/message/${messageId}/read`,
				method: 'POST',
			}),
			invalidatesTags: [{ type: 'Chats', id: 'LIST' }],
		}),
		createGroupChat: builder.mutation({
			query: (chat) => ({
				url: `/chat/group`,
				method: 'POST',
				body: chat,
			}),
			invalidatesTags: [{ type: 'Chats', id: 'LIST' }],
		}),
		updateGroupChat: builder.mutation({
			query: ({ chatId, chat }) => ({
				url: `/chat/group/${chatId}`,
				method: 'PUT',
				body: chat,
			}),
			invalidatesTags: (result, error, { chatId }) => [
				{ type: 'Chats', id: chatId },
				{ type: 'Chats', id: 'LIST' },
			],
		}),
		leaveChat: builder.mutation({
			query: ({ chatId }) => ({
				url: `/chat/${chatId}/leave`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { chatId }) => [
				{ type: 'Chats', id: chatId },
				{ type: 'Chats', id: 'LIST' },
			],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetChatListQuery,
	useGetChatQuery,
	useRemoveChatMutation,
	useGetChatMessageListQuery,
	useSendMessageMutation,
	useSendPrivateMessageMutation,
	useMarkMessageAsReadMutation,
	useCreateGroupChatMutation,
	useUpdateGroupChatMutation,
	useLeaveChatMutation,
} = chatApi;
