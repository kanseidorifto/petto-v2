import { useState, useEffect } from 'react';

import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfilePetCard from '../components/Profile/ProfilePetCard';
import CreatePostModal from '../components/Post/CreatePostModal';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from '../services/authService';
import PostList from '../components/Post/PostList';

const Profile = () => {
	const { id } = useParams();
	const [showModal, setShowModal] = useState({ show: false });
	const { userInfo } = useSelector((state) => state.auth);

	const own = userInfo.id === id || !id;
	const profileId = own ? userInfo.id : id;

	const profileInfo = useGetUserDetailsQuery(profileId);
	useEffect(() => {
		document.title =
			'Petto - Профіль ' +
			(!own && profileInfo.isSuccess
				? profileInfo.data.givenName + ' ' + profileInfo.data.surname
				: '');
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, [profileInfo, own]);

	if (profileInfo.isFetching) {
		return <div>Loading...</div>;
	}
	if (profileInfo.isError) {
		return <div className="text-red-700">Error {profileInfo.error.status}</div>;
	}

	const openModal = () => {
		setShowModal({ show: true });
	};

	const closeModal = () => {
		setShowModal({ show: false });
	};

	return (
		<>
			<ProfileHeader {...profileInfo.data} own={own} />
			<div className="flex gap-4 max-lg:flex-col-reverse ">
				<main className="flex-1">
					<div className="flex items-center justify-between px-6 py-3.5 text-white bg-violet-500 rounded-t-md">
						<h2 className="text-base font-medium">Дописи</h2>
						{own && (
							<button
								onClick={openModal}
								className="rounded-full leading-none font-semibold text-base py-1.5 px-2.5 bg-amber-500">
								Новий допис
							</button>
						)}
					</div>
					<div className="space-y-4 [&>*:first-child]:rounded-t-none">
						<PostList profileId={profileId} own={own} />
					</div>
				</main>
				<div>
					<aside className="rounded-md bg-violet-400">
						<div className="flex items-center justify-between px-6 py-4 text-white bg-violet-500 rounded-t-md">
							<h2 className="text-base font-medium">Улюбленці користувача</h2>
						</div>
						<div className="p-4 space-y-4">
							{profileInfo.data.pets?.length > 0 ? (
								<div className="grid sm:grid-cols-[1fr,1fr] gap-4 justify-items-center">
									{profileInfo.data.pets?.slice(0, 4).map((pet) => (
										<ProfilePetCard key={pet.id} {...pet} />
									))}
								</div>
							) : (
								<p className="inline-block w-full p-1.5 text-center text-white text-md">
									Жодного улюбленця 😿
								</p>
							)}
							<div className="text-center">
								<Link
									to={`/pets?userId=${profileId}`}
									className="w-64 bg-violet-600 text-white text-sm leading-none p-2.5 rounded-xl">
									Переглянути більше
								</Link>
							</div>
						</div>
					</aside>
				</div>
			</div>
			{own && <CreatePostModal modalIsOpen={showModal} closeModal={closeModal} />}
		</>
	);
};

export default Profile;
