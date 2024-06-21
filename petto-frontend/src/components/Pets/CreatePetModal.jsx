import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { dataUrlToFile } from '../../utils/dataUrlToFile';
import { useCreatePetMutation } from '../../services/petService';
import { toast } from 'react-toastify';
import { recognizePet } from '../../utils/recognizePet';
import { file2Base64 } from '../../utils/file2Base64';

Modal.setAppElement('#root');

const CreatePetModal = ({ modalIsOpen, closeModal }) => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		// setError,
		// eslint-disable-next-line
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			givenName: '',
			breed: '',
			age: '',
			bio: '',
		},
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});

	const [createPet] = useCreatePetMutation();

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
		setUploaded(null);
		closeModal();
		reset();
	};

	const onSubmit = async (values) => {
		const cropped = crop();
		const formData = new FormData();
		formData.append('givenName', values.givenName);
		formData.append('breed', values.breed);
		formData.append('age', values.age);
		formData.append('bio', values.bio);
		cropped &&
			formData.append(
				'avatarMedia',
				await dataUrlToFile(cropped, `petAvatar-${Math.random(10000000)}.png`, 'image/png'),
			);
		toast.promise(createPet(formData).unwrap(), {
			pending: `Створення улюбленця ${values.givenName} 😽`,
			success: `${values.givenName} успішно створений 👌`,
			error: `Помилка створення ${values.givenName}  🤯`,
		});
		closeCurrentModal();
	};

	const handleRecognize = async () => {
		const cropped = crop();
		const formData = new FormData();
		cropped &&
			formData.append(
				'file',
				await dataUrlToFile(cropped, `petAvatar-${Math.random(10000000)}.png`, 'image/png'),
			);
		const result = await toast.promise(recognizePet(formData), {
			pending: `Розпізнавання улюбленця 👀`,
			success: `Улюбленець успішно розпізнаний 👌`,
			error: `Помилка розпізнавання 🤯`,
		});
		console.log(result);
		setValue('breed', result.breed ? result.breed : result.species);
	};

	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={modalIsOpen.show}
			onAfterOpen={() => (document.body.style.overflow = 'hidden')}
			onAfterClose={() => (document.body.style.overflow = 'unset')}
			onRequestClose={closeCurrentModal}
			className={'mx-auto w-fit my-auto p-4'}
			contentLabel="Fill create pet modal">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex bg-white flex-col p-6 space-y-4 border rounded-md border-amber-500 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex items-center justify-between">
					<p className="text-xl text-amber-500">Додати улюбленця</p>
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
						<>
							<button
								type="button"
								onClick={() => fileRef.current?.click()}
								className="w-48 h-48 transition-all bg-cover border rounded-md brightness-90 border-violet-500 bg-violet-300 hover:bg-violet-300/50">
								<span className="text-violet-700">Додати</span>
							</button>
						</>
					)}
					<p>Фото</p>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between w-full space-x-4">
						<span>Кличка</span>
						<input
							type="text"
							{...register('givenName', { required: 'Введіть кличку улюбленця' })}
							className="px-2 py-2 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
						/>
					</div>
					<div className="flex items-center justify-between w-full space-x-4">
						<div className="flex gap-2">
							<span>Порода</span>
							{uploaded && (
								<button
									type="button"
									onClick={handleRecognize}
									className="rounded-full leading-none font-semibold text-sm py-1.5 px-2 text-white bg-amber-500">
									Розпізнати!
								</button>
							)}
						</div>
						<input
							type="text"
							{...register('breed', { required: 'Введіть породу улюбленця' })}
							className="px-2 py-2 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
						/>
					</div>
					<div className="flex items-center justify-between w-full space-x-4">
						<span>Вік</span>
						<input
							type="number"
							min={0}
							max={100}
							{...register('age', { required: 'Введіть  вік улюбленця' })}
							className="px-2 py-2 border rounded-md w-max border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
						/>
					</div>
					<div className="flex items-center justify-between w-full space-x-4">
						<span>Біографія</span>
						<input
							{...register('bio')}
							type="text"
							className="px-2 py-2 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
						/>
					</div>
				</div>
				<button
					type="submit"
					className="p-2.5 text-white font-semibold leading-none border rounded-xl border-violet-700 bg-violet-600">
					Додати
				</button>
			</form>
		</Modal>
	);
};

export default CreatePetModal;
