import Post from './Post';
import { useGetPetPostListQuery } from '../../services/postService';

const PetPostList = ({ petProfileId, petProfileInfo, own }) => {
	const profilePostList = useGetPetPostListQuery(petProfileId);
	return (
		<>
			{profilePostList?.data?.items?.length > 0 ? (
				profilePostList.data.items.map((post) => (
					<Post key={post.id} {...post} profileId={petProfileId} />
				))
			) : (
				<section className="text-white rounded-md bg-violet-400">
					<p className="px-6 py-10 text-lg font-medium text-center">
						{profilePostList.isFetching
							? 'Завантаження... 🏃‍♂️'
							: `Схоже ${petProfileInfo?.data?.givenName} поки немає дописів 😿`}
					</p>
				</section>
			)}
		</>
	);
};

export default PetPostList;
