import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import {
	useAcceptFriendRequestMutation,
	useCancelFriendRequestMutation,
	useLazyGetFriendRequestListQuery,
} from '../../services/authService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FriendRequestList = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [searchText, setSearchText] = useState('');
	const [activeTab, setActiveTab] = useState(0);
	const [getFriendRequestList, friendRequestListQuery] = useLazyGetFriendRequestListQuery();
	const [acceptFriendRequest] = useAcceptFriendRequestMutation();
	const [cancelFriendRequest] = useCancelFriendRequestMutation();
	useEffect(() => {
		let tab;
		switch (activeTab) {
			case 0:
				tab = 'Вхідні запити';
				getFriendRequestList(false);
				break;
			case 1:
				tab = 'Відправлені запити';
				getFriendRequestList(true);
				break;
			default:
				tab = '';
				break;
		}
		document.title = 'Petto - ' + tab;
		return () => {
			document.title = 'Petto';
		};
	}, [activeTab, getFriendRequestList]);

	const friendList =
		friendRequestListQuery.isFetching || friendRequestListQuery.isUninitialized
			? []
			: searchText !== ''
			? friendRequestListQuery.data.items
					?.map((friendRequest) =>
						friendRequest.profileRequest.id === userInfo.id
							? friendRequest.profileAccept
							: friendRequest.profileRequest,
					)
					.filter((friend) => {
						const match =
							(friend.givenName + ' ' + friend.surname)
								.toLowerCase()
								.indexOf(searchText.toLowerCase()) > -1;
						return match;
					})
			: friendRequestListQuery.data.items?.map((friendRequest) =>
					friendRequest.profileRequest.id === userInfo.id
						? friendRequest.profileAccept
						: friendRequest.profileRequest,
			  );

	const handleAcceptRequest = async (friend) => {
		if (confirm('✅ Прийняти запит у друзі від ' + friend.givenName + ' ' + friend.surname + '?'))
			toast.promise(acceptFriendRequest(friend.id).unwrap(), {
				pending: `Прийняття запиту у друзі від ${friend.givenName + ' ' + friend.surname} 🧐`,
				success: `${friend.givenName + ' ' + friend.surname} успішно доданий до друзів 👌`,
				error: `Помилка прийняття запиту у друзі від ${
					friend.givenName + ' ' + friend.surname
				}  🤯`,
			});
	};
	const handleCancelRequest = async (friend, direction) => {
		if (
			confirm(
				'❌ Відхилити запит у друзі ' +
					(direction ? 'від' : 'до') +
					' ' +
					friend.givenName +
					' ' +
					friend.surname +
					'?',
			)
		)
			toast.promise(cancelFriendRequest(friend.id).unwrap(), {
				pending:
					`Відхилення запиту у друзі ` +
					(direction ? 'від' : 'до') +
					` ${friend.givenName + ' ' + friend.surname} 🧐`,
				success:
					`Запит ` +
					(direction ? 'від' : 'до') +
					` ${friend.givenName + ' ' + friend.surname} успішно відхилений 👌`,
				error:
					`Помилка відхилення запиту у друзі ` +
					(direction ? 'від' : 'до') +
					` ${friend.givenName + ' ' + friend.surname}  🤯`,
			});
	};

	return (
		<main className="rounded-md bg-violet-400">
			<div className="flex items-center px-6 py-3 space-x-1 text-white bg-violet-500 rounded-t-md">
				<MagnifyingGlassIcon className="w-6 h-6" />
				<input
					type="text"
					className="flex-1 p-1 text-base bg-transparent rounded appearance-none resize-none placeholder:text-white placeholder:font-light focus:bg-violet-300/50 focus:outline-none focus:border-none focus:ring-none"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					placeholder="Пошук..."
				/>
			</div>
			<div className="px-4 py-2 space-y-2 text-white">
				<div className="flex gap-2 px-3 py-2 max-sm:flex-col">
					<button
						onClick={() => setActiveTab(0)}
						className={
							'px-2 py-2 border-2 hover:bg-violet-300/50 transition-all font-medium leading-none min-w-[10rem] border-violet-300 rounded-md' +
							(activeTab === 0 ? ' bg-violet-300/50' : '')
						}>
						Вхідні
					</button>
					<button
						onClick={() => setActiveTab(1)}
						className={
							'px-2 py-2 border-2 hover:bg-violet-300/50 transition-all font-medium leading-none min-w-[10rem] border-violet-300 rounded-md' +
							(activeTab === 1 ? ' bg-violet-300/50' : '')
						}>
						Відправлені
					</button>
				</div>
				{!friendRequestListQuery.isFetching ? (
					<div className="flex flex-col">
						{friendList.length > 0 ? (
							friendList.map((friend, index) => (
								<div key={index} className="flex w-full px-3 py-2">
									<div className="flex items-center space-x-3">
										<Link to={`/profile/${friend.id}`}>
											<img
												src={friend.avatarUrl}
												alt="avatar"
												className="w-12 h-12 rounded-full max-w-none"
											/>
										</Link>
										<div>
											<Link className="inline-block" to={`/profile/${friend.id}`}>
												<p>{friend.givenName + ' ' + friend.surname}</p>
											</Link>
											<div className="flex gap-2 max-sm:flex-col sm:items-center">
												<Link
													to={`/profile/${friend.id}`}
													className="text-neutral-300 hover:underline">
													Переглянути профіль
												</Link>
												<div className="flex items-center gap-2 px-4">
													{activeTab === 0 && (
														<button
															onClick={() => handleAcceptRequest(friend)}
															className="p-1 leading-none transition-all border rounded-md border-amber-400 hover:bg-amber-400 bg-amber-300">
															Прийняти запит
														</button>
													)}
													<button
														onClick={() => handleCancelRequest(friend, activeTab === 0)}
														className="p-1 leading-none text-white transition-colors rounded-md hover:underline hover:bg-violet-300 bg-violet-300/50">
														Відхилити запит
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="px-6 py-4 text-lg font-medium text-center">Нічого не знайдено. 😔</p>
						)}
					</div>
				) : (
					<p className="px-6 py-4 text-lg font-medium text-center">Завантаження... 🏃‍♂️</p>
				)}
			</div>
		</main>
	);
};

export default FriendRequestList;
