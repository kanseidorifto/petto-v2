import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { CheckIcon } from '@heroicons/react/24/outline';
import {
	useGetChatMessageListQuery,
	useMarkMessageAsReadMutation,
} from '../../services/chatService';
import { MessageType } from '../../utils/enums';

const UnsupportedMessage = ({ message }) => {
	if (!message) return null;

	const messageCopy = JSON.parse(JSON.stringify(message));
	messageCopy.messageText = <i className="text-neutral-300">Непідтримуваний тип повідомлення</i>;

	return <TextMessage message={messageCopy} />;
};

const InfoMessage = ({ message }) => {
	return (
		<div className="flex justify-center">
			<p className="text-neutral-200">{message.messageText}</p>
		</div>
	);
};

const BaseUserMessage = ({ message, children, readedBy, userInfo }) => {
	readedBy = readedBy || [];
	readedBy = readedBy.filter((profile) => profile.id !== message.senderProfile.id);
	return (
		<div className="flex space-x-2">
			<Link to={'/profile/' + message.senderProfile?.id} className="font-black">
				<img
					src={message.senderProfile?.avatarUrl}
					alt="avatar"
					className="w-8 h-8 bg-white rounded-full select-none"
				/>
			</Link>
			<div className="justify-between flex-1 ">
				<div className="flex items-center space-x-1">
					<Link to={'/profile/' + message.senderProfile?.id} className="font-black">
						<p className="text-base font-semibold">
							{message.senderProfile?.givenName + ' ' + message.senderProfile?.surname}
						</p>
					</Link>
					<span className="text-sm font-light text-neutral-200">
						{dayjs(message.createdAt).format('H:mm')}
					</span>
					{message.senderProfile.id == userInfo.id && (
						<>
							<CheckIcon className="w-4 h-4 text-neutral-200" />
							{readedBy?.length > 0 && (
								<div className="flex items-center -translate-x-4 space-x-1">
									<CheckIcon className="w-4 h-4 text-neutral-200" />
									{readedBy.map((profile) => (
										<Link key={profile.id} to={'/profile/' + profile.id}>
											<img
												src={profile.avatarUrl}
												alt="avatar"
												className="w-4 h-4 bg-white rounded-full select-none"
											/>
										</Link>
									))}
								</div>
							)}
						</>
					)}
				</div>
				{children}
			</div>
		</div>
	);
};

const TextMessage = ({ message, ...props }) => {
	return (
		<BaseUserMessage message={message} {...props}>
			<p>{message.messageText}</p>
		</BaseUserMessage>
	);
};

const ImageMessage = ({ message, ...props }) => {
	const imageUrls = message.messageMediaUrls || [];
	return (
		<BaseUserMessage message={message} {...props}>
			<div className="flex flex-wrap gap-2">
				{imageUrls.map((imageUrl, index) => (
					<div key={index} className="relative">
						<img
							src={imageUrl}
							alt="image"
							className="w-80 h-auto object-cover rounded-md peer"
							style={{ display: 'none' }}
							onLoad={(e) => ((e.target.style.display = ''), e.target.classList.add('loaded'))}
						/>
						<div className="w-80 h-96 bg-gray-200 rounded-md animate-pulse peer-[.loaded]:hidden" />
					</div>
				))}
			</div>
			<p>{message.messageText}</p>
		</BaseUserMessage>
	);
};

const Message = ({ message, ...props }) => {
	switch (message.messageType) {
		case MessageType.Info:
			return <InfoMessage message={message} {...props} />;
		case MessageType.Text:
			return <TextMessage message={message} {...props} />;
		case MessageType.Image:
			return <ImageMessage message={message} {...props} />;
		default:
			return <UnsupportedMessage message={message} {...props} />;
	}
};

const MessageList = ({ chatId, chatInfo, containerRef }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [pageNumber, setPageNumber] = useState(0);
	const messageList = useGetChatMessageListQuery({
		chatId,
		query: {
			pageNumber,
			pageSize: 20,
		},
	});

	//
	const loadMore = () => {
		if (messageList.data.totalCount <= messageList.data.items.length) return;
		setPageNumber((prev) => prev + 1);
	};

	//
	const [markAsRead] = useMarkMessageAsReadMutation();

	useEffect(() => {
		if (messageList.isSuccess) {
			const latestMessage = messageList.data?.items
				.filter((message) => message.senderProfile.id !== userInfo.id)
				.shift();
			if (latestMessage) {
				if (
					chatInfo?.participants.find((participant) => participant.profile.id === userInfo.id)
						?.lastReadedMessage?.id !== latestMessage.id
				) {
					markAsRead({ messageId: latestMessage.id });
				}
			}
		}
	}, [
		chatInfo?.participants,
		markAsRead,
		messageList.data?.items,
		messageList.isSuccess,
		userInfo.id,
	]);

	//
	useEffect(() => {
		containerRef?.current?.scroll({ top: containerRef.current?.scrollHeight });
	}, [containerRef, messageList.isLoading]);

	const { ref } = useInView({
		onChange: (inView) => {
			if (inView) {
				loadMore();
			}
		},
		threshold: 0,
	});

	//

	if (messageList.isLoading) {
		return <div>Loading...</div>;
	}

	if (messageList.isError) {
		return <div>Error {messageList.error.status}</div>;
	}

	//group message by days
	const groupedMessages = messageList.data.items.reduce((acc, message) => {
		const date = dayjs(message.createdAt).format('DD MMMM YYYY');
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(message);
		return acc;
	}, {});

	//
	const otherParticipants = chatInfo?.participants.filter(
		(participant) => participant.profile.id != userInfo.id,
	);

	return (
		<div className="flex justify-end flex-col-reverse gap-2 text-white py-2">
			{groupedMessages &&
				Object.keys(groupedMessages).map((date) => (
					<div key={date} className="flex flex-col-reverse gap-2">
						{groupedMessages[date].map((message) => {
							const readedBy = [];
							otherParticipants?.forEach((participant) => {
								if (
									new Date(message.createdAt) <= new Date(participant.lastReadedMessage?.createdAt)
								) {
									readedBy.push(participant.profile);
								}
							});
							return (
								<div key={message.id}>
									<Message message={message} readedBy={readedBy} userInfo={userInfo} />
								</div>
							);
						})}
						<p className="text-center text-neutral-300 last:pt-6">{date}</p>
					</div>
				))}
			<div ref={ref} className="pt-64" />
			<p></p>
		</div>
	);
};

export default MessageList;
