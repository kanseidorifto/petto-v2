import Post from './Post';
import { useGetMyFeedPostListQuery } from '../../services/postService';

const FeedPostList = () => {
	const feedPostList = useGetMyFeedPostListQuery();
	return (
		<>
			{feedPostList?.data?.items?.length > 0 ? (
				feedPostList.data.items?.map((post) => <Post key={post.id} {...post} />)
			) : (
				<section className="text-white rounded-md bg-violet-400">
					<p className="px-6 py-10 text-lg font-medium text-center">
						{feedPostList.isLoading ? 'Завантаження... 🏃‍♂️' : 'Схоже у вас поки немає дописів 😿'}
					</p>
				</section>
			)}
		</>
	);
};

export default FeedPostList;
