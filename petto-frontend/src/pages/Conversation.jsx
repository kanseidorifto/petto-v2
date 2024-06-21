import {
	ArrowLeftIcon,
	EllipsisHorizontalIcon,
	PaperAirplaneIcon,
	PaperClipIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';

import MessageList from '../components/Chat/MessageList';
import {
	useGetChatQuery,
	useLeaveChatMutation,
	useSendMessageMutation,
} from '../services/chatService';
import { MessageType } from '../utils/enums';
import { file2Base64 } from '../utils/file2Base64';
import EditChatModal from '../components/Chat/EditChatModal';
import useModal from '../hooks/useModal';

const Conversation = () => {
	const { chatId } = useParams();
	const { userInfo } = useSelector((state) => state.auth);

	const chatInfo = useGetChatQuery(chatId);

	const personProfile =
		chatInfo.data?.type == 0 &&
		chatInfo.data?.participants.filter((participant) => participant.profile.id !== userInfo.id)[0]
			.profile;
	const title =
		chatInfo.data?.title ??
		(chatInfo.data?.type === 0
			? `${personProfile.givenName} ${personProfile.surname}`
			: chatInfo.data?.participants.map((participant) => participant.profile.givenName).join(', '));

	const iconUrl = chatInfo.data?.type === 0 ? personProfile.avatarUrl : chatInfo.data?.iconUrl;

	useEffect(() => {
		document.title = 'Petto - Чат ' + (chatInfo.isSuccess ? title : '');
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, [chatInfo.isSuccess, title]);

	//
	const [sendMessage] = useSendMessageMutation();

	const [messageText, setMessageText] = useState('');

	const handleSendMessage = async () => {
		if (messageText.trim() === '' && files.length == 0) return;
		setMessageText('');

		const message = new FormData();

		if (files.length > 0) {
			if (files.length > 5) {
				alert('Максимальна кількість файлів - 5');
				return;
			}

			await Promise.all(
				files.map(async (file) => {
					message.append('messageMediaList', file);
				}),
			);

			setFiles([]);
			setFileIcons([]);
			message.append('messageType', MessageType.Image);
		} else {
			message.append('messageType', MessageType.Text);
		}

		messageText.trim() !== '' && message.append('messageText', messageText);
		try {
			await sendMessage({ chatId, message }).unwrap();
			containerRef.current.scroll({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
		} catch {
			toast.error('Помилка відправлення повідомлення');
		}
	};

	//
	const containerRef = useRef(null);

	//
	const fileInputRef = useRef(null);
	const [files, setFiles] = useState([]);
	const [fileIcons, setFileIcons] = useState([]);

	const handleFileUpload = async (e) => {
		const files = Array.from(e.target.files);
		setFiles((prev) => [...prev, ...files]);

		const fileIcons = await Promise.all(
			files.map(async (file) => {
				let icon = '';
				if (file.type.startsWith('image/')) {
					icon = await file2Base64(file);
					return { name: file.name, icon };
				}
				return { name: file.name, icon };
			}),
		);

		setFileIcons((prev) => [...prev, ...fileIcons]);
	};

	//
	const navigate = useNavigate();
	const [leaveChat] = useLeaveChatMutation();

	const handleLeaveChat = async () => {
		if (window.confirm('Покинути чат?')) {
			try {
				await leaveChat({ chatId }).unwrap();
				navigate('/chats');
			} catch {
				toast.error('Помилка виходу з чату');
			}
		}
	};

	//
	const { open } = useModal('editChatModal');
	const [openPopup, setOpenPopup] = useState(false);

	//

	if (chatInfo.isLoading) {
		return <div>Loading...</div>;
	}
	if (chatInfo.isError) {
		return <div className="text-red-700">Error {chatInfo.error.status}</div>;
	}

	return (
		<div className="flex h-full gap-4">
			<div className="flex h-full flex-col flex-1">
				<div className="flex gap-2 items-center px-6 py-3 text-white bg-violet-500 rounded-t-md">
					<Link to="/chats" className="flex items-center space-x-2">
						<ArrowLeftIcon className="w-6 h-6" />
					</Link>
					<div className="flex gap-2 flex-1">
						{iconUrl ? (
							<img
								src={iconUrl}
								alt="chat icon"
								className="rounded-full aspect-square w-12 object-cover"
							/>
						) : (
							<div className="rounded-full aspect-square w-12 bg-violet-600 flex items-center justify-center">
								<p className="text-xl font-bold">?</p>
							</div>
						)}
						<div className="flex-1">
							<p className="font-bold">{title}</p>
							{chatInfo.data.type === 0 ? (
								<span className="text-neutral-300">Не в мережі</span>
							) : (
								<span className="text-neutral-300">1 в мережі</span>
							)}
						</div>
						{chatInfo.data.type !== 0 && (
							<Popup
								trigger={
									<button className="lg:hidden">
										<EllipsisHorizontalIcon className="w-8 h-8" />
									</button>
								}
								closeOnDocumentClick
								open={openPopup}
								onOpen={() => setOpenPopup(true)}
								onClose={() => setOpenPopup(false)}
								position="bottom right">
								{/* <ChatPopup own={chat.profileId === userInfo.id} chatId={chat.id} /> */}
								<div className="flex flex-col border-2 divide-y rounded-md text-violet-700 border-violet-700 bg-violet-400 divide-violet-700 hover:[&_>_*]:bg-violet-300 hover:[&_>_*]:rounded-md first:hover:[&_>_*]:rounded-b-none last:hover:[&_>_*]:rounded-t-none">
									{chatInfo.data.profile.id === userInfo.id ? (
										<button
											onClick={() => (setOpenPopup(false), open(chatInfo.data))}
											className="p-2 leading-none text-white">
											Налаштування групи
										</button>
									) : (
										<button
											onClick={() => (setOpenPopup(false), handleLeaveChat())}
											className="p-2 leading-none text-red-400 bg-red-400/20">
											Покинути
										</button>
									)}
								</div>
							</Popup>
						)}
					</div>
				</div>
				<div
					ref={containerRef}
					className="px-6 flex-1 flex flex-col bg-violet-400 overflow-y-scroll scrollbar-thin">
					<div className="flex-grow" />
					<MessageList chatId={chatId} chatInfo={chatInfo.data} containerRef={containerRef} />
				</div>
				{fileIcons.length > 0 && (
					<div className="flex items-center gap-2 p-2 bg-violet-500">
						{fileIcons.map((file, index) => (
							<div
								key={index}
								className="flex gap-2 items-center p-2 text-white bg-violet-400 rounded-md">
								<button
									onClick={() => {
										if (window.confirm('Видалити файл?')) {
											setFiles((prev) => prev.filter((_, i) => i !== index));
											setFileIcons((prev) => prev.filter((_, i) => i !== index));
										}
									}}
									className="transition-colors rounded-md shadow text-violet-100 hover:bg-violet-300/50">
									<XMarkIcon className="w-6 h-6" />
								</button>
								<img src={file.icon} alt="" className="w-64 max-h-64" />
							</div>
						))}
					</div>
				)}
				<div className="flex gap-2 items-center px-6 py-2 text-white bg-violet-500 rounded-b-md">
					<input
						ref={fileInputRef}
						onChange={handleFileUpload}
						type="file"
						className="hidden"
						multiple
						accept="image/*"
					/>
					<button
						onClick={() => fileInputRef.current.click()}
						className="p-2 transition-colors rounded-md shadow text-violet-100 hover:bg-violet-300/50">
						<PaperClipIcon className="w-8 h-8" />
					</button>
					<TextareaAutosize
						className="flex-1 p-1 text-base transition-colors bg-transparent rounded appearance-none resize-none placeholder:text-white placeholder:font-light hover:bg-violet-300/20 focus:bg-violet-300/50 focus:outline-none focus:border-none focus:ring-none"
						value={messageText}
						onChange={(e) => setMessageText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && e.shiftKey === false) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
						placeholder="Написати вістойку..."
					/>
					<button
						onClick={handleSendMessage}
						className="p-2 transition-colors rounded-md shadow text-violet-100 hover:bg-violet-300/50">
						<PaperAirplaneIcon className="w-8 h-8" />
					</button>
				</div>
			</div>
			{chatInfo.data.type !== 0 && (
				<div className="max-lg:hidden">
					<aside className="rounded-md w-64 xl:w-72 bg-violet-400">
						<div className="flex items-center justify-between px-6 py-4 text-white bg-violet-500 rounded-t-md">
							<h2 className="text-base font-medium">Інформація про чат</h2>
						</div>
						<div className="p-4 space-y-4 text-white">
							<div className="flex flex-col items-center gap-2">
								{chatInfo.data.iconUrl ? (
									<img
										src={chatInfo.data.iconUrl}
										alt="chat icon"
										className="rounded-full aspect-square w-40 object-cover"
									/>
								) : (
									<div className="rounded-full aspect-square w-40 bg-violet-500 flex items-center justify-center">
										<p className="text-4xl font-bold">?</p>
									</div>
								)}
								<p className="text-lg font-bold">{chatInfo.data.title}</p>
								<p className="text-sm font-medium">Учасники</p>
								<div className="flex flex-wrap gap-2 justify-center">
									{chatInfo.data.participants.map((participant) => (
										<Link
											key={participant.profile.id}
											to={`/profile/${participant.profile.id}`}
											className="flex items-center gap-1">
											<img
												key={participant.profile.id}
												src={participant.profile.avatarUrl}
												alt="participant"
												className="w-12 h-12 rounded-full"
											/>
										</Link>
									))}
								</div>
							</div>
							<div className="text-center space-y-1">
								{chatInfo.data.profile.id === userInfo.id ? (
									<button
										onClick={() => open(chatInfo.data)}
										className="w-full bg-violet-600 text-white text-sm leading-none p-2.5 rounded-xl hover:opacity-70 transition-opacity">
										Налаштування групи
									</button>
								) : (
									<button
										onClick={handleLeaveChat}
										className="w-full bg-red-600 text-white text-sm leading-none p-2.5 rounded-xl hover:opacity-70 transition-opacity">
										Покинути
									</button>
								)}
							</div>
						</div>
					</aside>
				</div>
			)}
			<EditChatModal modalKey="editChatModal" />
		</div>
	);
};

export default Conversation;
