import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PetCard from '../components/Pets/PetCard';
import CreatePetModal from '../components/Pets/CreatePetModal';
import { useGetUserPetListQuery } from '../services/petService';
import UpdatePetModal from '../components/Pets/UpdatePetModal';

const Pets = () => {
	const { t } = useTranslation();
	useEffect(() => {
		document.title = 'Petto - ' + t('pets.head.title');
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, [t]);
	const [showCreateModal, setShowCreateModal] = useState({ show: false });
	const [showUpdateModal, setShowUpdateModal] = useState({ show: false });
	const { userInfo } = useSelector((state) => state.auth);
	const [urlSearchParams] = useSearchParams();
	const userId = urlSearchParams.get('userId');

	const own = userInfo.id === userId || !userId;
	const profileId = own ? userInfo.id : userId;
	const petList = useGetUserPetListQuery(profileId);

	const openCreateModal = () => {
		setShowCreateModal({ show: true });
	};

	const closeCreateModal = () => {
		setShowCreateModal({ show: false });
	};
	const openUpdateModal = (pet) => {
		setShowUpdateModal({ show: true, pet });
	};

	const closeUpdateModal = () => {
		setShowUpdateModal({ show: false });
	};

	if (petList.isFetching) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<main className="rounded-md bg-violet-400">
				<div className="flex items-center justify-between px-6 py-3 text-white bg-violet-500 rounded-t-md">
					<h2 className="text-base font-medium">{t('pets.title')}</h2>
					{own && (
						<button
							onClick={openCreateModal}
							className="px-4 py-2 text-xs font-semibold leading-none rounded-full bg-violet-700">
							{t('pets.add_button')}
						</button>
					)}
				</div>
				<div className="p-4 space-y-4">
					{petList.data?.items?.length ? (
						<div className="flex flex-wrap justify-center">
							{petList.data.items?.map((pet) => (
								<div key={pet.id} className="m-4">
									<PetCard {...pet} profileId={profileId} openUpdateModal={openUpdateModal} />
								</div>
							))}
						</div>
					) : (
						<section className="text-white rounded-md bg-violet-400">
							<p className="px-6 py-10 text-lg font-medium text-center">
								{petList.isLoading
									? t('pets.loading_list')
									: own
									? t('pets.empty_list_owner')
									: t('pets.empty_list')}
							</p>
						</section>
					)}
				</div>
			</main>
			{own && <CreatePetModal modalIsOpen={showCreateModal} closeModal={closeCreateModal} />}
			{own && petList?.data?.items?.length > 0 && (
				<UpdatePetModal modalIsOpen={showUpdateModal} closeModal={closeUpdateModal} />
			)}
		</>
	);
};

export default Pets;
