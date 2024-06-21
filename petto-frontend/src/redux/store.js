import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import modalReducer from './modal/modalSlice';
import { baseApi } from '../services/baseService';

const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([baseApi.middleware]),
});
export default store;
