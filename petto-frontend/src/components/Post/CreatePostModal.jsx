import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import TextareaAutosize from 'react-textarea-autosize';
import { Gallery } from 'react-grid-gallery';
import Popup from 'reactjs-popup';
import { PetTaggingPopup } from '../Pets/PetTagging';
import { useGetMyPetListQuery } from '../../services/petService';
import { useCreateUserPostMutation } from '../../services/postService';
import { toast } from 'react-toastify';
Modal.setAppElement('#root');

const CreatePostModal = ({ modalIsOpen, afterOpenModal, closeModal }) => {
	const {
		register,
		handleSubmit,
		reset,
		// setError,
		// eslint-disable-next-line
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			writtenText: '',
		},
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});
	const { data: petList, isFetching, isError } = useGetMyPetListQuery();
	const [createPost, newPost] = useCreateUserPostMutation();
	const [availablePetList, setAvailablePetList] = useState();
	useEffect(() => {
		setAvailablePetList(petList?.items);
	}, [petList]);

	const [openPetPopup, setOpenPetPopup] = useState(false);
	const [selectedPetList, setSelectedPetList] = useState([]);
	const addPicturesRef = useRef();
	const [mediaList, setMediaList] = useState([]);
	const [mediaDisplayList, setMediaDisplayList] = useState([]);
	function uploader(e) {
		const image = URL.createObjectURL(e.target.files[0]);

		setMediaDisplayList((prev) => [...prev, { src: image, customOverlay: null }]);
		setMediaList((prev) => [...prev, e.target.files[0]]);
	}
	const resetMedia = () => {
		setAvailablePetList(petList?.items);
		setSelectedPetList([]);
		setMediaDisplayList([]);
		setMediaList([]);
	};

	const closeOrderModal = () => {
		resetMedia();
		closeModal();
		reset();
	};

	const onSubmit = async (values) => {
		const taggedPetList = selectedPetList.map((pet) => pet.id);
		const formData = new FormData();
		formData.append('writtenText', values.writtenText);
		mediaList.forEach((file) => formData.append('mediaList', file));
		// formData.append('taggedPetsIds', JSON.stringify(taggedPetList));
		taggedPetList.forEach((pet) => formData.append('taggedPetsIds', pet));
		toast.promise(createPost(formData).unwrap(), {
			pending: 'Створення допису 📄',
			success: 'Допис успішно створений 👌',
			error: 'Помилка створення допису 🤯',
		});
		closeOrderModal();
	};

	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={modalIsOpen.show}
			onAfterOpen={() => (document.body.style.overflow = 'hidden')}
			onAfterClose={() => (document.body.style.overflow = 'unset')}
			onRequestClose={closeOrderModal}
			className={'mx-auto z-10 w-fit my-auto p-4'} //absolute inset-0
			contentLabel="Fill register modal">
			{/* <div className="p-6 bg-white border border-black w-fit rounded-3xl  &[ReactModal__Overlay--after-open:translate-y-0]"> */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex bg-white flex-col p-6 max-xl:max-w-screen-md space-y-4 border rounded-md border-amber-500 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex justify-between">
					<p className="text-2xl align-middle text-amber-500">Створити допис</p>
					<button type="button" onClick={closeOrderModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<input
					type="file"
					hidden
					ref={addPicturesRef}
					onChange={(e) => {
						uploader(e);
					}}
					accept="image/png,image/jpeg,image/gif"
				/>
				{mediaDisplayList.length <= 0 ? (
					<button
						type="button"
						onClick={() => addPicturesRef.current.click()}
						className="py-24 transition-all border rounded-md border-violet-500 bg-violet-300 hover:bg-violet-300/50">
						<span className="text-violet-700">Додати світлини</span>
					</button>
				) : (
					<div className="flex justify-between">
						<button
							type="button"
							className="px-3 py-1 leading-none text-white rounded-full bg-violet-600"
							onClick={() => addPicturesRef.current.click()}>
							Додати світлину
						</button>
						<button
							type="button"
							className="px-3 py-1 leading-none text-white bg-red-600 rounded-full"
							onClick={() => resetMedia()}>
							Очистити
						</button>
					</div>
				)}
				<Gallery images={mediaDisplayList} />
				<TextareaAutosize
					{...register('writtenText')}
					className="flex-1 p-2 text-base bg-transparent border rounded appearance-none resize-none border-violet-500 text-neutral-900 placeholder:text-neutral-600 placeholder:font-light focus:bg-violet-200/50 focus:outline-none focus:border-violet-700 focus:ring-none"
					placeholder="Що у вас нового?"
				/>
				<div className="p-2 border rounded-md border-violet-500 space-y-2.5">
					<div className="flex items-center justify-between space-x-2">
						<span className="text-neutral-600">Позначте своїх улюбленців</span>

						{!isFetching && !isError && availablePetList?.length > 0 && (
							<Popup
								trigger={
									<button
										onClick={() => setOpenPetPopup(true)}
										type="button"
										className="px-3 py-1 leading-none text-white rounded-full bg-violet-600">
										Додати
									</button>
								}
								closeOnDocumentClick
								open={openPetPopup}
								onOpen={() => setOpenPetPopup(true)}
								onClose={() => setOpenPetPopup(false)}
								position="top right">
								<PetTaggingPopup
									petList={availablePetList}
									onClickAddPet={(pet) => {
										setAvailablePetList((prev) => prev.filter((obj) => obj !== pet));
										setSelectedPetList((prev) => [...prev, pet]);
										setOpenPetPopup(false);
									}}
								/>
							</Popup>
						)}
					</div>
					{selectedPetList.length > 0 && (
						<div className="grid grid-cols-2 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1">
							{selectedPetList.map((pet, index) => (
								<div key={index} className="relative group">
									<div className="flex p-1 items-center border rounded-md border-violet-500 space-x-1.5">
										<img
											src={pet.avatarUrl}
											alt="Pet Avatar"
											className="w-8 h-8 bg-white rounded-full"
										/>
										<span className="truncate">{pet.givenName}</span>
									</div>
									<button
										type="button"
										onClick={() => {
											setAvailablePetList((prev) => [...prev, pet]);
											setSelectedPetList((prev) => prev.filter((obj) => obj !== pet));
										}}
										className="absolute top-0 w-full h-full text-center transition-all border border-red-700 rounded-md opacity-0 bg-red-700/80 group-hover:opacity-100">
										<XMarkIcon className="w-6 h-6 mx-auto text-white" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<button
					type="submit"
					className="p-2.5 text-white leading-none border rounded-xl border-amber-600 bg-amber-500">
					Опублікувати
				</button>
			</form>
			{/* </div> */}
		</Modal>
	);
};

export default CreatePostModal;
