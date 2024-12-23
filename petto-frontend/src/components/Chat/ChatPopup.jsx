import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRemoveChatMutation } from '../../services/chatService';

const ChatPopup = ({ chatId, own }) => {
	const { t } = useTranslation();
	const [removeChat] = useRemoveChatMutation();
	const onClickDelete = () => {
		if (confirm(t('chats.removeChatConfirm'))) {
			toast.promise(removeChat(chatId).unwrap(), {
				pending: t('notifications.removeChat.pending'),
				success: t('notifications.removeChat.success'),
				error: t('notifications.removeChat.error'),
			});
		}
	};
	return (
		<div className="flex flex-col border-2 divide-y rounded-md text-violet-700 border-violet-700 bg-violet-300 divide-violet-700 hover:[&_>_*]:bg-violet-200 hover:[&_>_*]:rounded-md first:hover:[&_>_*]:rounded-b-none last:hover:[&_>_*]:rounded-t-none">
			{own && (
				<button onClick={onClickDelete} className="p-2 text-sm leading-none text-red-700">
					{t('chats.popup.remove')}	</button>
			)}
		</div>
	);
};
export default ChatPopup;
