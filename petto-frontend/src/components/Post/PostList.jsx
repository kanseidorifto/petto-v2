import Post from './Post';
import { useTranslation } from 'react-i18next';
import { useGetUserPostListQuery } from '../../services/postService';

const PostList = ({ profileId, own }) => {
	const { t } = useTranslation();
	const profilePostList = useGetUserPostListQuery(profileId);
	return (
		<>
			{profilePostList?.data?.items?.length > 0 ? (
				profilePostList.data.items.map((post) => (
					<Post key={post.id} {...post} profileId={profileId} />
				))
			) : (
				<section className="text-white rounded-md bg-violet-400">
					<p className="px-6 py-10 text-lg font-medium text-center">
						{profilePostList.isFetching
							? t('post.list.loading')
							: own
							? t('post.list.empty_owner')
							: t('post.list.empty')}
					</p>
				</section>
			)}
		</>
	);
};

export default PostList;
