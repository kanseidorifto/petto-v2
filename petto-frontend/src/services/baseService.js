import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const backendURL = import.meta.env.VITE_APP_API_URL;

export const baseApi = createApi({
	baseQuery: fetchBaseQuery({
		// base url of backend API
		baseUrl: backendURL,
		// mode: 'no-cors',
		// credentials: 'omit',
		// prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.userToken;
			if (token) {
				// include token in req header
				headers.set('Authorization', `Bearer ${token}`);
				return headers;
			}
		},
	}),
	tagTypes: ['Auth', 'Posts', 'Pets', 'Friends', 'Chats', 'Messages'],
	endpoints: () => ({}),
});
