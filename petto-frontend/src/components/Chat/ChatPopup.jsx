import { toast } from 'react-toastify';
import { useRemoveChatMutation } from '../../services/chatService';

const ChatPopup = ({ chatId, own }) => {
	const [removeChat] = useRemoveChatMutation();
	const onClickDelete = () => {
		if (confirm('Видалити чат?')) {
			toast.promise(removeChat(chatId).unwrap(), {
				pending: 'Видалення чату...',
				success: 'Допис успішно видалено 👌',
				error: 'Помилка видалення чату 🤯',
			});
		}
	};
	return (
		<div className="flex flex-col border-2 divide-y rounded-md text-violet-700 border-violet-700 bg-violet-300 divide-violet-700 hover:[&_>_*]:bg-violet-200 hover:[&_>_*]:rounded-md first:hover:[&_>_*]:rounded-b-none last:hover:[&_>_*]:rounded-t-none">
			{own && (
				<button onClick={onClickDelete} className="p-2 text-sm leading-none text-red-700">
					Видалити чат
				</button>
			)}
		</div>
	);
};
export default ChatPopup;
