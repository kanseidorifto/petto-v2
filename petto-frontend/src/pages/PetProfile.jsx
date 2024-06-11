import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetPetQuery } from '../services/petService';

import PetPostList from '../components/Post/PetPostList';
import { formatYears } from '../utils/formatYears';

const PetProfile = () => {
	const { petId } = useParams();
	const { userInfo } = useSelector((state) => state.auth);
	const petProfileInfo = useGetPetQuery(petId);
	useEffect(() => {
		document.title =
			'Petto - Профіль ' + (petProfileInfo.isSuccess ? petProfileInfo.data.givenName : '');
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, [petProfileInfo]);

	if (petProfileInfo.isFetching) {
		return <div>Loading...</div>;
	}
	if (petProfileInfo.isError) {
		return <div className="text-red-700">Error {petProfileInfo.error.status}</div>;
	}

	const own = petProfileInfo.data.owner.id === userInfo.id;

	return (
		<>
			<div className="flex gap-4 max-lg:flex-col-reverse ">
				<main className="flex-1">
					<div className="flex items-center justify-between px-6 py-4 text-white bg-violet-500 rounded-t-md">
						<h2 className="text-base font-medium">Дописи</h2>
					</div>
					<div className="space-y-4  [&>*:first-child]:rounded-t-none">
						<PetPostList petProfileId={petId} petProfileInfo={petProfileInfo} own={own} />
					</div>
				</main>
				<div>
					<aside className="text-white rounded-md md:w-96 bg-violet-400">
						{/* <div className="flex items-center justify-between px-6 py-4 text-white bg-violet-500 rounded-t-md">
							<h2 className="text-base font-medium">Улюбленець</h2>
						</div> */}
						<div className="select-none md:w-96 md:h-96">
							<img
								src={petProfileInfo.data.avatarUrl}
								alt="Pet Avatar"
								className="object-cover w-full h-full rounded-t-md"
							/>
						</div>
						<div className="flex flex-col max-w-full gap-2 p-3 text-center md:gap-4">
							<p className="text-xl font-semibold">{petProfileInfo.data.givenName}</p>
							<p className="text-base">
								Порода: <span className="font-semibold">{petProfileInfo.data.breed}</span>
							</p>
							<p className="text-base">
								Вік: <span className="font-semibold">{formatYears(petProfileInfo.data.age)}</span>
							</p>
							{petProfileInfo.data.bio?.length > 0 && (
								<p className="max-w-full text-base">
									Біографія: <span className="font-semibold">{petProfileInfo.data.bio}</span>
								</p>
							)}
							<p className="text-base">
								Власник:{' '}
								<Link
									to={`/profile/${petProfileInfo.data.owner.id}`}
									className="p-1 font-semibold rounded-md shadow-sm bg-amber-500 hover:underline">
									{petProfileInfo.data.owner.givenName + ' ' + petProfileInfo.data.owner.surname}
								</Link>
							</p>
						</div>
					</aside>
				</div>
			</div>
		</>
	);
};

export default PetProfile;
