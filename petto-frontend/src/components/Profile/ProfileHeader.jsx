import { Link, useNavigate } from 'react-router-dom';
import { useSendFriendRequestMutation } from '../../services/authService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SendPrivateMessageModal from './SendPrivateMessageModal';
import useModal from '../../hooks/useModal';

const ProfileHeader = ({ id, givenName, surname, bio, avatarUrl, coverUrl, own }) => {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.auth);
	const [sendFriendRequest] = useSendFriendRequestMutation();

	const { open } = useModal('sendPrivateMessageModal');

	const onClickEditProfile = () => {
		navigate('/settings/profile');
	};

	const isFriend = userInfo?.friends?.some((friend) => friend.id === id);

	const onClickSendFriendRequest = () => {
		toast.promise(sendFriendRequest(id).unwrap(), {
			pending: t('notifications.sendFriendRequest.pending'),
			success: t('notifications.sendFriendRequest.success'),
			error: t('notifications.sendFriendRequest.error'),
		});
	};

	const onClickSendMessage = () => {
		open({ id });
	};

	return (
		<div>
			<div className="w-full rounded-md bg-violet-400">
				<div
					className="bg-center bg-no-repeat bg-cover shadow-inner select-none h-80 rounded-t-md"
					style={{ backgroundImage: `url('${coverUrl}')` }}></div>
				<div className="flex gap-4 p-6 text-white rounded-md max-lg:flex-col ProfileInfo bg-violet-500">
					<div className="select-none -mt-36">
						<img
							className="w-48 h-48 bg-white rounded-full shadow-md border-amber-300"
							src={avatarUrl}
							alt="avatar"
						/>
					</div>
					<div className="flex justify-between flex-1 gap-4 max-md:flex-col md:items-center">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold leading-none">{givenName + ' ' + surname}</h2>
							<p className="text-base font-light leading-none">{bio}</p>
						</div>
						<div>
							{own ? (
								<Link to={'/settings/profile'}>
									<button
										onClick={onClickEditProfile}
										className="text-sm leading-none bg-violet-600 min-w-[192px] p-3 rounded-xl">
										{t('profile.header.edit_profile')}{' '}
									</button>
								</Link>
							) : isFriend ? (
								<button
									onClick={onClickSendMessage}
									className="text-sm leading-none border-violet-400 hover:bg-violet-600 bg-violet-400  min-w-[192px] p-3 rounded-xl transition-colors">
									{t('profile.header.write_message')}{' '}
								</button>
							) : (
								<button
									onClick={onClickSendFriendRequest}
									className="text-sm leading-none border-amber-400 hover:bg-amber-500 bg-amber-400  min-w-[192px] p-3 rounded-xl transition-colors">
									{t('profile.header.add_friend')}{' '}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			<SendPrivateMessageModal modalKey="sendPrivateMessageModal" />
		</div>
	);
};

export default ProfileHeader;
