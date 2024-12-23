import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRemoveUserPostMutation } from '../../services/postService';

const PostPopup = ({ postId, own }) => {
	const { t } = useTranslation();
	const [removePost] = useRemoveUserPostMutation();
	const onClickDelete = () => {
		if (confirm(t('post.popup.delete.confirm'))) {
			toast.promise(removePost(postId).unwrap(), {
				pending: t('notifications.removePost.pending'),
				success: t('notifications.removePost.success'),
				error: t('notifications.removePost.error'),
			});
		}
	};
	return (
		<div className="flex flex-col border-2 divide-y rounded-md text-violet-700 border-violet-700 bg-violet-300 divide-violet-700 hover:[&_>_*]:bg-violet-200 hover:[&_>_*]:rounded-md first:hover:[&_>_*]:rounded-b-none last:hover:[&_>_*]:rounded-t-none">
			{/* <button className="p-2 text-sm leading-none">Копіювати посилання</button> */}
			{own && (
				<button onClick={onClickDelete} className="p-2 text-sm leading-none text-red-700">
					{t('post.popup.delete.delete_post')}
				</button>
			)}
		</div>
	);
};
export default PostPopup;
