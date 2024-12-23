import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCancelFriendRequestMutation, useGetFriendListQuery } from '../../services/authService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FriendList = () => {
	const { t } = useTranslation();
	const { userInfo } = useSelector((state) => state.auth);
	useEffect(() => {
		document.title = 'Petto - ' + t('friends.head.title');
		return () => {
			document.title = 'Petto';
		};
	}, []);
	const [searchText, setSearchText] = useState('');
	const friendListQuery = useGetFriendListQuery();
	const [cancelFriendRequest] = useCancelFriendRequestMutation();

	const friendList = friendListQuery.isFetching
		? []
		: searchText !== ''
		? friendListQuery.data.items
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
		: friendListQuery.data.items?.map((friendRequest) =>
				friendRequest.profileRequest.id === userInfo.id
					? friendRequest.profileAccept
					: friendRequest.profileRequest,
		);

	const handleCancelFriend = async (friend) => {
		if (
			confirm(
				t('friends.deleteAlert.confirm', { givenName: friend.givenName, surname: friend.surname }),
			)
		)
			toast.promise(cancelFriendRequest(friend.id).unwrap(), {
				pending: t('friends.deleteAlert.pending', {
					givenName: friend.givenName,
					surname: friend.surname,
				}),
				success: t('friends.deleteAlert.success', {
					givenName: friend.givenName,
					surname: friend.surname,
				}),
				error: t('friends.deleteAlert.error', {
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
				{!friendListQuery.isFetching ? (
					<div className="flex flex-col">
						{friendList.length > 0 ? (
							friendList.map((friend, index) => (
								<div key={index} className="flex w-full px-3 py-2">
									<div className="flex items-center flex-1 space-x-3">
										<Link to={`/profile/${friend.id}`}>
											<img src={friend.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
										</Link>
										<div className="flex-1">
											<Link className="inline-block" to={`/profile/${friend.id}`}>
												<p>{friend.givenName + ' ' + friend.surname}</p>
											</Link>
											<div className="flex items-center justify-between space-x-2">
												<Link
													to={`/profile/${friend.id}`}
													className="text-neutral-300 hover:underline">
													{t('friends.search.entry.view_profile')}{' '}
												</Link>
												{false && (
													<Link
														to={`/message/${friend.id}`}
														className="text-neutral-300 hover:underline">
														{t('friends.search.entry.write_message')}{' '}
													</Link>
												)}
												<button
													onClick={() => handleCancelFriend(friend)}
													className="p-1.5 leading-none transition-all bg-red-600 border border-red-700 rounded-md hover:bg-red-100 hover:text-red-400">
													{t('friends.search.entry.cancel_friendship')}{' '}
												</button>
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

export default FriendList;
