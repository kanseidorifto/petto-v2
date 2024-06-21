import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import useModal from '../../hooks/useModal';
import { useSendPrivateMessageMutation } from '../../services/chatService';
import { MessageType } from '../../utils/enums';
import ReactTextareaAutosize from 'react-textarea-autosize';

Modal.setAppElement('#root');

const SendPrivateMessageModal = ({ modalKey }) => {
	const navigate = useNavigate();
	const { isModalOpen, modalData, close } = useModal(modalKey);
	const {
		register,
		handleSubmit,
		reset,
		// setError,
		// eslint-disable-next-line
		formState: { errors, isValid },
	} = useForm({
		defaultValues: { messageText: '' },
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});
	useEffect(() => {
		reset();
	}, [modalData, reset]);

	const resetMedia = () => {};

	const closeCurrentModal = () => {
		close();
		resetMedia();
		reset();
	};

	//
	const [sendPrivateMessage] = useSendPrivateMessageMutation();

	const onSubmit = async (values) => {
		if (values.messageText.trim() === '') {
			toast.error('Повідомлення не може бути порожнім');
			return;
		}

		const formData = new FormData();
		formData.append('messageText', values.messageText);
		formData.append('messageType', MessageType.Text);

		toast
			.promise(sendPrivateMessage({ userId: modalData?.id, message: formData }).unwrap(), {
				pending: `Відправлення повідомлення 💬`,
				success: `Повідомлення успішно відправлено 👌`,
				error: `Помилка оновлення надсилання 🤯`,
			})
			.then((data) => {
				console.log(data);
				navigate(`/chats/${data.chatRoomId}`);
			});
		closeCurrentModal();
	};

	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={isModalOpen}
			onAfterOpen={() => (document.body.style.overflow = 'hidden')}
			onAfterClose={() => (document.body.style.overflow = 'unset')}
			onRequestClose={closeCurrentModal}
			className={'mx-auto w-fit my-auto p-4'}
			contentLabel="Send private message modal">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex bg-white h-72 flex-col p-6 gap-4 border rounded-md border-amber-500 z-20 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex items-center justify-between">
					<p className="text-xl text-amber-500">Надіслати повідомлення</p>
					<button type="button" onClick={closeCurrentModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<ReactTextareaAutosize
					className="flex-1 p-1 text-base transition-colors bg-transparent rounded-md border resize-none placeholder:font-light hover:bg-amber-300/20 border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					{...register('messageText', { required: true })}
					placeholder="Написати вістойку..."
				/>
				<div className="flex flex-col gap-2">
					<button
						type="submit"
						className="p-2.5 text-white font-semibold leading-none border rounded-xl border-violet-700 bg-violet-600">
						Відправити
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default SendPrivateMessageModal;
