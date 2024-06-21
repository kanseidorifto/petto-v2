import Modal from 'react-modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { dataUrlToFile } from '../../utils/dataUrlToFile';

import { toast } from 'react-toastify';
import useModal from '../../hooks/useModal';
import { file2Base64 } from '../../utils/file2Base64';
import { useRemoveChatMutation, useUpdateGroupChatMutation } from '../../services/chatService';
import { useForm } from 'react-hook-form';
import { AddParticipantPopup } from './AddParticipantPopup';
import { useGetFriendListQuery } from '../../services/authService';
import Popup from 'reactjs-popup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const EditChatModal = ({ modalKey }) => {
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
		defaultValues: {},
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});
	useEffect(() => {
		reset();
	}, [modalData, reset]);

	const fileRef = useRef();

	const [uploaded, setUploaded] = useState(null);
	// const [cropped, setCropped] = useState(null);
	const cropperRef = useRef();

	const onFileInputChange = (e) => {
		const file = e.target?.files?.[0];
		if (file) {
			file2Base64(file).then((base64) => {
				setUploaded(base64);
			});
		}
	};

	const crop = () => {
		const imageElement = cropperRef?.current;
		const cropper = imageElement?.cropper;
		return cropper.getCroppedCanvas().toDataURL();
	};

	const closeCurrentModal = () => {
		close();
		resetMedia();
		reset();
	};

	//
	const { userInfo } = useSelector((state) => state.auth);
	const currentUserList = useMemo(
		() =>
			modalData?.participants
				.map((participant) => participant.profile)
				.filter((user) => user.id !== userInfo.id) || [],
		[modalData, userInfo.id],
	);

	const friendshipList = useGetFriendListQuery();
	// const [friendList, setFriendList] = useState([]);
	const [availableUserList, setAvailableUserList] = useState();
	const [selectedUserList, setSelectedUserList] = useState([]);

	const friendList = useMemo(() => {
		if (friendshipList.data) {
			return friendshipList.data?.items?.map((friendRequest) =>
				friendRequest.profileRequest.id === userInfo.id
					? friendRequest.profileAccept
					: friendRequest.profileRequest,
			);
		}
	}, [friendshipList.data, userInfo.id]);

	useEffect(() => {
		if (friendshipList.data) {
			setAvailableUserList(
				friendList.filter((user) => !currentUserList.some((obj) => obj.id === user.id)),
			);
			setSelectedUserList(currentUserList);
		}
	}, [currentUserList, friendList, friendshipList.data, userInfo.id]);

	const [openAddPopup, setOpenAddPopup] = useState(false);

	//
	const resetMedia = () => {
		setAvailableUserList(friendList);
		setSelectedUserList([]);
		setUploaded(null);
	};

	const [updateGroupChat] = useUpdateGroupChatMutation();

	const onSubmit = async (values) => {
		const cropped = uploaded ? crop() : null;
		const formData = new FormData();
		values.title && formData.append('title', values.title);

		if (selectedUserList.length === 0) {
			toast.error('Додайте учасників до чату');
			return;
		}

		cropped &&
			formData.append(
				'iconMedia',
				await dataUrlToFile(cropped, `chatIcon-${Math.random(10000000)}.png`, 'image/png'),
			);
		selectedUserList.forEach((user) => {
			formData.append('participants', user.id);
		});
		toast.promise(updateGroupChat({ chatId: modalData?.id, chat: formData }).unwrap(), {
			pending: `Оновлення чату ${values.title || ''} 💬`,
			success: `${values.title || 'Чат'} успішно оновлений 👌`,
			error: `Помилка оновлення ${values.title || 'чату'}  🤯`,
		});
		closeCurrentModal();
	};

	//
	const [removeChat] = useRemoveChatMutation();

	const handleDelete = () => {
		if (!window.confirm(`Ви впевнені, що хочете видалити чат ${modalData.title ?? ''}?`)) return;
		toast
			.promise(removeChat(modalData.id).unwrap(), {
				pending: `Видалення чату ${modalData.title || ''} 💬`,
				success: `${modalData.title || 'Чат'} успішно видалений 👌`,
				error: `Помилка видалення ${modalData.title || ''}  🤯`,
			})
			.then(() => {
				navigate('/chats');
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
			contentLabel="Update Chat modal">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex bg-white flex-col p-6 space-y-4 border rounded-md border-amber-500 z-20 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex items-center justify-between">
					<p className="text-xl text-amber-500">Редагувати чат</p>
					<button type="button" onClick={closeCurrentModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<div className="flex flex-col items-center space-y-2 text-center">
					<input
						type="file"
						style={{ display: 'none' }}
						ref={fileRef}
						onChange={onFileInputChange}
						accept="image/png,image/jpeg,image/gif"
					/>
					{uploaded ? (
						<div>
							<Cropper
								src={uploaded}
								className="max-w-[20rem] md:max-w-[24rem] xl:max-w-[32rem] 2xl:max-w-[60rem]"
								// style={{ maxHeight: '80vh', width: 'auto' }}
								autoCropArea={1}
								responsive={true}
								aspectRatio={1}
								viewMode={2}
								guides={false}
								ref={cropperRef}
							/>
							<button type="button" onClick={() => fileRef.current?.click()}>
								Змінити
							</button>
						</div>
					) : (
						<div className="relative w-48 h-48">
							{modalData?.iconUrl && (
								<img
									src={modalData.iconUrl}
									alt="old chat icon"
									className="w-full h-full rounded-md"
								/>
							)}
							<button
								type="button"
								onClick={() => fileRef.current?.click()}
								className="absolute top-0 left-0 w-48 h-48 transition-all bg-cover border rounded-md shadow-inner brightness-90 border-violet-500 bg-violet-300/30 hover:bg-violet-300/70">
								<span className="font-semibold text-violet-700">Змінити</span>
							</button>
						</div>
					)}
					<p>Фото</p>
				</div>
				<div className="space-y-2">
					<div className="flex items-center w-full space-x-4">
						<span>Назва</span>
						<input
							type="text"
							defaultValue={modalData?.title}
							{...register('title')}
							className="px-2 py-2 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
						/>
					</div>
					{/* <div className="flex items-center justify-between w-full space-x-4">
						<span>Опис</span>
						<input
							{...register('description')}
							type="text"
							className="px-2 py-2 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
						/>
					</div> */}
				</div>
				<div className="p-2 border rounded-md border-violet-500 space-y-2.5">
					<div className="flex items-center justify-between space-x-2">
						<span className="text-neutral-600">Додайте учасників</span>

						{!friendshipList.isFetching &&
							!friendshipList.isError &&
							availableUserList?.length > 0 && (
								<Popup
									trigger={
										<button
											type="button"
											className="px-3 py-1 leading-none text-white rounded-full bg-violet-600">
											Додати
										</button>
									}
									closeOnDocumentClick
									open={openAddPopup}
									onOpen={() => setOpenAddPopup(true)}
									onClose={() => setOpenAddPopup(false)}
									position="top right">
									<AddParticipantPopup
										userList={availableUserList}
										onClickAdd={(user) => {
											setAvailableUserList((prev) => prev.filter((obj) => obj.id !== user.id));
											setSelectedUserList((prev) => [...prev, user]);
											setOpenAddPopup(false);
										}}
									/>
								</Popup>
							)}
					</div>
					{selectedUserList.length > 0 && (
						<div className="grid grid-cols-2 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1">
							{selectedUserList.map((user, index) => (
								<div key={index} className="relative group">
									<div className="flex p-1 items-center border rounded-md border-violet-500 space-x-1.5">
										<img
											src={user.avatarUrl}
											alt="User Avatar"
											className="w-8 h-8 bg-white rounded-full"
										/>
										<span className="truncate">{user.givenName}</span>
									</div>
									<button
										type="button"
										onClick={() => {
											setAvailableUserList((prev) => [...prev, user]);
											setSelectedUserList((prev) => prev.filter((obj) => obj.id !== user.id));
										}}
										className="absolute top-0 w-full h-full text-center transition-all border border-red-700 rounded-md opacity-0 bg-red-700/80 group-hover:opacity-100">
										<XMarkIcon className="w-6 h-6 mx-auto text-white" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<button
						type="submit"
						className="p-2.5 text-white font-semibold leading-none border rounded-xl border-violet-700 bg-violet-600">
						Оновити
					</button>
					<button
						type="button"
						onClick={handleDelete}
						className="p-2.5 text-white font-semibold leading-none border rounded-xl border-red-700 bg-red-600">
						Видалити
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default EditChatModal;
