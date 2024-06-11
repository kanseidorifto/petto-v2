import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import modalReducer from './modal/modalSlice';
import { authApi } from '../services/authService';
import { postApi } from '../services/postService';
import { petApi } from '../services/petService';

const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
		[authApi.reducerPath]: authApi.reducer,
		[postApi.reducerPath]: postApi.reducer,
		[petApi.reducerPath]: petApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat([authApi.middleware, postApi.middleware, petApi.middleware]),
});
export default store;
