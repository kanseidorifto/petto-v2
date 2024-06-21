export const AddParticipantPopup = ({ userList, onClickAdd }) => {
	return (
		<div className="flex flex-col border-2 divide-y rounded-md text-violet-700 border-violet-700 bg-violet-300 divide-violet-700 hover:[&_>_*]:bg-violet-200 hover:[&_>_*]:rounded-md first:hover:[&_>_*]:rounded-b-none last:hover:[&_>_*]:rounded-t-none">
			{userList?.map((user) => (
				<button
					key={user.id}
					onClick={() => {
						onClickAdd(user);
					}}
					className="text-sm leading-none">
					<div className="flex p-1 items-center space-x-1.5">
						<img src={user.avatarUrl} alt="Pet Avatar" className="w-8 h-8 bg-white rounded-full" />
						<span className="truncate">
							{user.givenName} {user.surname}
						</span>
					</div>
				</button>
			))}
		</div>
	);
};
