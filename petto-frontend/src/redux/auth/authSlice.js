import { createSlice } from '@reduxjs/toolkit';
import { registerUser, userLogin, getMe } from './authActions';

// initialize userToken from local storage
const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;

const initialState = {
	loading: false,
	userInfo: null, // for user object
	userToken: userToken, // for storing the JWT
	error: null,
	success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			localStorage.removeItem('userToken'); // delete token from storage
			state.loading = false;
			state.userInfo = null;
			state.userToken = null;
			state.error = null;
		},
		setCredentials: (state, { payload }) => {
			state.userInfo = payload;
		},
	},
	extraReducers: {
		// login user
		[userLogin.pending]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[userLogin.fulfilled]: (state, { payload }) => {
			state.loading = false;
			state.success = true; // login successful
			state.userInfo = payload;
			state.userToken = payload.token;
			// store user's token in local storage
			localStorage.setItem('userToken', payload.token);
		},
		[userLogin.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
		// register user
		[registerUser.pending]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[registerUser.fulfilled]: (state, { payload }) => {
			state.loading = false;
			state.success = true; // registration successful

			state.userInfo = payload;
			state.userToken = payload.token;
			// store user's token in local storage
			localStorage.setItem('userToken', payload.token);
		},
		[registerUser.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},

		// getMe
		[getMe.pending]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[getMe.fulfilled]: (state, { payload }) => {
			state.loading = false;
			state.success = true;
			state.userInfo = payload;
		},
		[getMe.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
			localStorage.removeItem('userToken'); // delete token from storage
			state.userInfo = null;
			state.userToken = null;
			state.success = false;
		},
	},
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
