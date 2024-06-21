import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { useGetChatListQuery } from '../services/chatService';
import { useDebounce } from '../hooks/useDebounce';
import ChatItem from '../components/Chat/ChatItem';
import CreateChatModal from '../components/Chat/CreateChatModal';
import useModal from '../hooks/useModal';

const Chats = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [searchText, setSearchText] = useState('');

	const chatList = useGetChatListQuery({ search: searchText });
	useEffect(() => {
		document.title = 'Petto - Чати';
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, []);

	const debounceSearch = useDebounce((search) => {
		setSearchText(search);
		console.log('search:', search);
	});

	//
	const { open } = useModal('createChatModal');

	return (
		<main className="rounded-md bg-violet-400">
			<div className="flex items-center px-6 py-3 space-x-1 text-white bg-violet-500 rounded-t-md">
				<MagnifyingGlassIcon className="w-6 h-6" />
				<input
					type="text"
					className="flex-1 p-1 text-base bg-transparent rounded appearance-none resize-none placeholder:text-white placeholder:font-light focus:bg-violet-300/50 focus:outline-none focus:border-none focus:ring-none"
					// value={searchText}
					onChange={(e) => debounceSearch(e.target.value)}
					placeholder="Пошук..."
				/>
				<button
					onClick={() => open()}
					className="rounded-full leading-none font-semibold text-xs py-1.5 px-2.5 bg-amber-500">
					Створити чат
				</button>
			</div>
			<div className="px-4 py-2 space-y-2 text-white">
				{!chatList.isFetching ? (
					<div className="flex flex-col">
						{chatList.data?.items?.length > 0 ? (
							chatList.data.items.map((chat, index) => (
								<ChatItem key={index} chat={chat} userInfo={userInfo} />
							))
						) : (
							<p className="px-6 py-4 text-lg font-medium text-center">Нічого не знайдено. 😔</p>
						)}
					</div>
				) : (
					<p className="px-6 py-4 text-lg font-medium text-center">Завантаження... 🏃‍♂️</p>
				)}
			</div>
			<CreateChatModal modalKey="createChatModal" />
		</main>
	);
};

export default Chats;
