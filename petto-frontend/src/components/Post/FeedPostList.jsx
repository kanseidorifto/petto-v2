import Post from './Post';
import { useTranslation } from 'react-i18next';
import { useGetMyFeedPostListQuery } from '../../services/postService';

const FeedPostList = () => {
	const { t } = useTranslation();
	const feedPostList = useGetMyFeedPostListQuery();
	return (
		<>
			{feedPostList?.data?.items?.length > 0 ? (
				feedPostList.data.items?.map((post) => <Post key={post.id} {...post} />)
			) : (
				<section className="text-white rounded-md bg-violet-400">
					<p className="px-6 py-10 text-lg font-medium text-center">
						{feedPostList.isLoading ? t('feed.loading_list') : t('feed.empty_list')}
					</p>
				</section>
			)}
		</>
	);
};

export default FeedPostList;
