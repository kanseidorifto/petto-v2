import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	useAcceptFriendRequestMutation,
	useCancelFriendRequestMutation,
	useLazyGetFriendRequestListQuery,
} from '../../services/authService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FriendRequestList = () => {
	const { t } = useTranslation();
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
				tab = t('friends.requests.head.title.incoming');
				getFriendRequestList(false);
				break;
			case 1:
				tab = t('friends.requests.head.title.outcoming');
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
	}, [activeTab, getFriendRequestList, t]);

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
		if (confirm(t('friends.requests.acceptAlert.confirm', { givenName: friend.givenName, surname: friend.surname })))
			toast.promise(acceptFriendRequest(friend.id).unwrap(), {
				pending: t('friends.requests.acceptAlert.pending', { givenName: friend.givenName, surname: friend.surname }),
				success: t('friends.requests.acceptAlert.success', { givenName: friend.givenName, surname: friend.surname }),
				error: t('friends.requests.acceptAlert.error', { givenName: friend.givenName, surname: friend.surname }),
			});
	};
	const handleCancelRequest = async (friend, direction) => {
		if (
			confirm(
				t('friends.requests.cancelAlert.confirm', {
					direction: direction ? t('friends.requests.cancelAlert.from') : t('friends.requests.cancelAlert.to'),
					givenName: friend.givenName,
					surname: friend.surname,
				})
			)
		)
			toast.promise(cancelFriendRequest(friend.id).unwrap(), {
				pending: t('friends.requests.cancelAlert.pending', {
					direction: direction ? t('friends.requests.cancelAlert.from') : t('friends.requests.cancelAlert.to'),
					givenName: friend.givenName,
					surname: friend.surname,
				}),
				success: t('friends.requests.cancelAlert.success', {
					direction: direction ? t('friends.requests.cancelAlert.from') : t('friends.requests.cancelAlert.to'),
					givenName: friend.givenName,
					surname: friend.surname,
				}),
				error: t('friends.requests.cancelAlert.error', {
					direction: direction ? t('friends.requests.cancelAlert.from') : t('friends.requests.cancelAlert.to'),
					givenName: friend.givenName,
					surname: friend.surname,
				}),
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
					placeholder={t('friends.search.placeholder')}
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
						{t('friends.requests.options.incoming')}
					</button>
					<button
						onClick={() => setActiveTab(1)}
						className={
							'px-2 py-2 border-2 hover:bg-violet-300/50 transition-all font-medium leading-none min-w-[10rem] border-violet-300 rounded-md' +
							(activeTab === 1 ? ' bg-violet-300/50' : '')
						}>
						{t('friends.requests.options.outcoming')}
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
													{t('friends.search.entry.view_profile')}
												</Link>
												<div className="flex items-center gap-2 px-4">
													{activeTab === 0 && (
														<button
															onClick={() => handleAcceptRequest(friend)}
															className="p-1 leading-none transition-all border rounded-md border-amber-400 hover:bg-amber-400 bg-amber-300">
															{t('friends.requests.entry.accept')}
														</button>
													)}
													<button
														onClick={() => handleCancelRequest(friend, activeTab === 0)}
														className="p-1 leading-none text-white transition-colors rounded-md hover:underline hover:bg-violet-300 bg-violet-300/50">
														{t('friends.requests.entry.reject')}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="px-6 py-4 text-lg font-medium text-center">
								{t('friends.search.empty_list')}
							</p>
						)}
					</div>
				) : (
					<p className="px-6 py-4 text-lg font-medium text-center">
						{t('friends.search.loading_list')}
					</p>
				)}
			</div>
		</main>
	);
};

export default FriendRequestList;
