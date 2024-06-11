import { useForm } from 'react-hook-form';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import ChangePhotoModal from './ChangePhotoModal';
import { useState } from 'react';
import { useGetOwnerDetailsQuery, useUpdateOwnerDetailsMutation } from '../../services/authService';
import { dataUrlToFile } from '../../utils/dataUrlToFile';
import { toast } from 'react-toastify';

const ProfilePreferences = () => {
	const profile = useGetOwnerDetailsQuery();
	const [updateProfile] = useUpdateOwnerDetailsMutation();
	const {
		register,
		handleSubmit,
		reset,
		// setError,
		// eslint-disable-next-line
		formState: { errors, isValid },
	} = useForm({
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});
	const [newAvatar, setNewAvatar] = useState(null);
	const [newCover, setNewCover] = useState(null);
	const [showModal, setShowModal] = useState({ show: false });

	if (profile.isFetching) {
		return (
			<main className="px-6 py-4 text-white rounded-md bg-violet-400">
				<p className="px-6 py-10 text-lg font-medium text-center">Завантаження... 🏃‍♂️</p>
			</main>
		);
	}

	const openModal = ({ label, aspectRatio, setResult }) => {
		setShowModal({ show: true, label, aspectRatio, setResult });
	};
	const closeModal = () => {
		setShowModal((prev) => ({ ...prev, show: false }));
	};
	const handleAvatarChange = () => {
		openModal({ label: 'Змінити основне фото', aspectRatio: 1, setResult: setNewAvatar });
	};
	const handleCoverChange = () => {
		openModal({ label: 'Змінити обкладинку', aspectRatio: 3, setResult: setNewCover });
	};
	const onSubmit = async (values) => {
		const formData = new FormData();
		formData.append('givenName', values.givenName);
		formData.append('surname', values.surname);
		formData.append('bio', values.bio);
		newAvatar &&
			formData.append(
				'avatarMedia',
				await dataUrlToFile(newAvatar, `avatar-${profile.data.id}.png`, 'image/png'),
			);
		newCover &&
			formData.append(
				'coverMedia',
				await dataUrlToFile(newCover, `cover-${profile.data.id}.png`, 'image/png'),
			);
		toast.promise(updateProfile(formData).unwrap(), {
			pending: 'Оновлення...',
			success: 'Профіль успішно оновлений 👌',
			error: 'Помилка оновлення профілю 🤯',
		});
	};

	return (
		<main className="px-2 py-2 text-white rounded-md sm:px-6 sm:py-4 bg-violet-400">
			<form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
				<div className="grid grid-cols-3 gap-6 p-1">
					<div className="self-center text-right">
						<p>Фото</p>
					</div>
					<div className="relative w-32 h-32 col-span-2">
						{profile.data.avatarUrl !== '' || newAvatar ? (
							<img
								src={newAvatar ? newAvatar : profile.data.avatarUrl}
								alt="Avatar"
								className="w-32 h-32 rounded-full max-w-none bg-violet-700"
							/>
						) : (
							<div className="w-32 h-32 rounded-full max-w-none bg-violet-700"></div>
						)}
						<div className="rounded-full shadow-[inset_0_0_20px_10px_rgba(0,0,0,0.25)] w-full h-full top-0 bottom-0 absolute"></div>
						<button
							onClick={handleAvatarChange}
							type="button"
							className="absolute inset-0 transition-colors rounded-full hover:bg-violet-300/50">
							<PencilSquareIcon className="w-8 h-8 mx-auto text-white" />
						</button>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 p-1 sm:p-3">
					<div className="self-center text-right">
						<p>Обкладинка профілю</p>
					</div>
					<div className="relative w-full col-span-2 md:w-64">
						{profile.data.coverUrl !== '' || newCover ? (
							<img
								src={newCover ? newCover : profile.data.coverUrl}
								alt="Header"
								className="object-contain w-full rounded-md bg-violet-700"
							/>
						) : (
							<div className="object-contain w-full rounded-md aspect-[3] bg-violet-700"></div>
						)}
						<div className="shadow-[inset_0_0_20px_10px_rgba(0,0,0,0.25)] rounded-md w-full h-full top-0 bottom-0 absolute"></div>
						<button
							onClick={handleCoverChange}
							type="button"
							className="absolute inset-0 transition-colors rounded-md hover:bg-violet-300/50">
							<span className="text-white">Змінити</span>
						</button>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 p-1 sm:p-3">
					<div className="self-center text-right">
						<p>Ім&apos;я</p>
					</div>
					<div className="col-span-2">
						<input
							type="text"
							defaultValue={profile.data.givenName}
							{...register('givenName', { required: "Введіть своє ім'я" })}
							className="max-w-full px-2 py-2 bg-transparent border rounded-md border-violet-700 focus:outline-none focus:ring-violet-800 focus:border-violet-800"
						/>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 p-1 sm:p-3">
					<div className="self-center text-right">
						<p>Прізвище</p>
					</div>
					<div className="col-span-2">
						<input
							type="text"
							defaultValue={profile.data.surname}
							{...register('surname', { required: 'Введіть своє прізвище' })}
							className="max-w-full px-2 py-2 bg-transparent border rounded-md border-violet-700 focus:outline-none focus:ring-violet-800 focus:border-violet-800"
						/>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 p-1 sm:p-3">
					<div className="self-center text-right">
						<p>Біографія</p>
					</div>
					<div className="col-span-2">
						<input
							type="text"
							defaultValue={profile.data.bio}
							{...register('bio')}
							className="max-w-full px-2 py-2 bg-transparent border rounded-md border-violet-700 focus:outline-none focus:ring-violet-800 focus:border-violet-800"
						/>
					</div>
				</div>
				<div className="p-3 text-center">
					<button className="p-3 min-w-[200px] leading-none bg-violet-700 hover:bg-violet-500 transition-colors rounded-xl">
						Зберегти зміни
					</button>
				</div>
			</form>
			<ChangePhotoModal modalIsOpen={showModal} closeModal={closeModal} />
		</main>
	);
};

export default ProfilePreferences;
