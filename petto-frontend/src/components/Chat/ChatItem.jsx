// import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
// import ChatPopup from './ChatPopup';
import { MessageType } from '../../utils/enums';
import { useMemo } from 'react';

const ChatItem = ({ chat, userInfo }) => {
	const {t} = useTranslation();
	const personProfile =
		chat.type == 0 &&
		chat.participants.filter((participant) => participant.profile.id !== userInfo.id)[0].profile;
	const title =
		chat.title ??
		(chat.type === 0
			? `${personProfile.givenName} ${personProfile.surname}`
			: chat.participants.map((participant) => participant.profile.givenName).join(', '));

	const iconUrl = chat.type === 0 ? personProfile.avatarUrl : chat.iconUrl;

	const currentParticipant = useMemo(
		() => chat.participants.find((participant) => participant.profile.id === userInfo.id),
		[chat.participants, userInfo.id],
	);

	const isReaded =
		chat.lastMessage.senderProfile.id === userInfo.id ||
		new Date(currentParticipant.lastReadedMessage?.createdAt) >=
			new Date(chat.lastMessage.createdAt);
	return (
		<Link
			to={`/chats/${chat.id}`}
			className={
				'w-full px-3 py-2 flex items-center space-x-3 hover:bg-violet-300/60 transition-colors rounded-lg ' +
				(!isReaded ? 'bg-amber-400/80' : '')
			}>
			{iconUrl ? (
				<img
					src={iconUrl}
					alt="chat icon"
					className="object-cover w-12 rounded-full aspect-square"
				/>
			) : (
				<div className="flex items-center justify-center w-12 rounded-full aspect-square bg-violet-600">
					<p className="text-xl font-bold">?</p>
				</div>
			)}
			<div className="flex-1">
				<div className="flex justify-between w-full">
					<p>{title}</p>
					<div className="flex items-center gap-2">
						<p> {dayjs(chat.lastMessage?.createdAt).format('DD/MM/YYYY H:mm')}</p>

						{/* <Popup
							trigger={
								<button>
									<EllipsisHorizontalIcon className="w-6 h-6" />
								</button>
							}
							closeOnDocumentClick
							position="bottom right">
							<ChatPopup own={chat.profileId === userInfo.id} chatId={chat.id} />
						</Popup> */}
					</div>
				</div>
				<div className="flex items-center gap-1">
					{chat.lastMessage?.senderProfile.id === userInfo.id
						? t('chats.item.current_user_is_last_sender')+': '
						: chat.type === 0
						? ''
						: `${chat.lastMessage?.senderProfile.givenName}: `}
					{chat.lastMessage.messageText ||
						(chat.lastMessage.messageType == MessageType.Image ? (
							<span className="flex items-center gap-1">
								<img
									src={chat.lastMessage.messageMediaUrls?.[0]}
									alt=""
									className="object-cover w-4 h-4"
								/>
								<span>{t('chats.item.type.picture')}</span>
							</span>
						) : (
							t('chats.item.message')
						))}
				</div>
			</div>
		</Link>
	);
};

export default ChatItem;
