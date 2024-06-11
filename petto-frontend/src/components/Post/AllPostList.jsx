import Post from './Post';
import { useGetAllPostListQuery } from '../../services/postService';

const AllPostList = () => {
	const allPostList = useGetAllPostListQuery();
	return (
		<>
			{allPostList?.data?.items?.length > 0 ? (
				allPostList.data.items?.map((post) => <Post key={post.id} {...post} />)
			) : (
				<section className="text-white rounded-md bg-violet-400">
					<p className="px-6 py-10 text-lg font-medium text-center">
						{allPostList.isFetching ? 'Завантаження... 🏃‍♂️' : 'Схоже у вас поки немає дописів 😿'}
					</p>
				</section>
			)}
		</>
	);
};

export default AllPostList;
