import { useDispatch, useSelector } from 'react-redux';
import {
	openModal,
	closeModal,
	selectIsModalOpen,
	selectModalData,
} from '../redux/modal/modalSlice';

const useModal = (modalKey) => {
	const dispatch = useDispatch();
	const isModalOpen = useSelector(selectIsModalOpen(modalKey));
	const modalData = useSelector(selectModalData(modalKey));

	const open = (data) => dispatch(openModal({ modalKey, data }));
	const close = () => dispatch(closeModal({ modalKey }));

	return { isModalOpen, modalData, open, close };
};

export default useModal;
