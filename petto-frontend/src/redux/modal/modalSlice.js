import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
	name: 'modal',
	initialState: {},
	reducers: {
		openModal: (state, action) => {
			const { modalKey, data } = action.payload;
			state[modalKey] = { isOpen: true, data };
		},
		closeModal: (state, action) => {
			const { modalKey } = action.payload;
			state[modalKey] = { isOpen: false };
		},
		// Add other modal-related actions here
	},
});

export const { openModal, closeModal } = modalSlice.actions;

// Selectors for getting modal state by key
export const selectModalData = (modalKey) => (state) => state.modal[modalKey]?.data;
export const selectIsModalOpen = (modalKey) => (state) => state.modal[modalKey]?.isOpen;

export default modalSlice.reducer;
