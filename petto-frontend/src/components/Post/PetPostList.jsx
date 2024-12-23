import Post from './Post';
import { useTranslation } from 'react-i18next';
import { useGetPetPostListQuery } from '../../services/postService';

const PetPostList = ({ petProfileId, petProfileInfo }) => {
	const { t } = useTranslation();
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
							? t('post.list.loading')
							: t('post.list.empty_pet', { pet_name: petProfileInfo?.data?.givenName })}
					</p>
				</section>
			)}
		</>
	);
};

export default PetPostList;
