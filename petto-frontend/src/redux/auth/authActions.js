import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const backendURL = process.env.VITE_APP_API_URL; //'/api';

export const registerUser = createAsyncThunk(
	'auth/register',
	async ({ givenName, surname, email, password }, { rejectWithValue }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: false,
			};
			const { data } = await toast.promise(
				axios.post(`${backendURL}/auth/register`, { givenName, surname, email, password }, config),
				{
					pending: 'Реєстрація...',
					success: 'Успішно зареєстровано 👌',
					error: 'Помилка реєстрації 🤯',
				},
			);
			return data;
		} catch (error) {
			// return custom error message from backend if present
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

export const userLogin = createAsyncThunk(
	'auth/login',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			// configure header's Content-Type as JSON
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: false,
			};
			const { data } = await toast.promise(
				axios.post(`${backendURL}/auth/login`, { email, password }, config),
				{
					pending: 'Вхід...',
					success: 'Успішний вхід 👌',
					error: 'Помилка входу 🤯',
				},
			);
			localStorage.setItem('userToken', data.token);
			return data;
		} catch (error) {
			// return custom error message from API if any
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);
export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
	try {
		const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;
		// configure header's Content-Type as JSON
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userToken}`,
			},
			withCredentials: false,
		};
		const { data } = await axios.get(`${backendURL}/user/me`, config);
		return data;
	} catch (error) {
		// return custom error message from API if any
		if (error.response && error.response.data.message) {
			return rejectWithValue(error.response.data.message);
		} else {
			return rejectWithValue(error.message);
		}
	}
});
