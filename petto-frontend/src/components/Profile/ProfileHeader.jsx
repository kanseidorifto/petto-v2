import { Link, useNavigate } from 'react-router-dom';
import { useSendFriendRequestMutation } from '../../services/authService';
import { toast } from 'react-toastify';

const ProfileHeader = ({ id, givenName, surname, bio, avatarUrl, coverUrl, own }) => {
	const navigate = useNavigate();
	const [sendFriendRequest] = useSendFriendRequestMutation();

	const onClickEditProfile = () => {
		navigate('/settings/profile');
	};

	const onClickSendFriendRequest = () => {
		toast.promise(sendFriendRequest(id).unwrap(), {
			pending: 'Надсилання запиту у друзі...',
			success: 'Запит успішно надіслано 👌',
			error: 'Помилка надсилання запиту у друзі. Можливо такий запит уже існує. 🤯',
		});
	};
	return (
		<div>
			<div className="w-full rounded-md bg-violet-400">
				<div
					className="bg-center bg-no-repeat bg-cover shadow-inner select-none h-80 rounded-t-md"
					style={{ backgroundImage: `url('${coverUrl}')` }}></div>
				<div className="flex p-6 max-lg:flex-col gap-4 text-white rounded-md ProfileInfo bg-violet-500">
					<div className="select-none -mt-36">
						<img
							className="w-48 h-48 bg-white rounded-full shadow-md border-amber-300"
							src={avatarUrl}
							alt="avatar"
						/>
					</div>
					<div className="flex max-md:flex-col gap-4 md:items-center justify-between flex-1">
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
										Редагувати профіль
									</button>
								</Link>
							) : (
								<button
									onClick={onClickSendFriendRequest}
									className="text-sm leading-none border-amber-400 hover:bg-amber-500 bg-amber-400  min-w-[192px] p-3 rounded-xl">
									Додати друга
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
