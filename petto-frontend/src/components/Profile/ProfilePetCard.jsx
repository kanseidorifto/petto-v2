import { Link } from 'react-router-dom';

const ProfilePetCard = ({ id, givenName, avatarUrl }) => {
	return (
		<Link to={`/pets/${id}`}>
			<div className="w-40 transition-transform rounded-md bg-violet-300 hover:-translate-y-1">
				<div className="w-40 h-40">
					<img src={avatarUrl} alt="" className="rounded-t-md" />
				</div>
				<div className="p-1 bg-violet-500 rounded-b-md">
					<p className="text-center text-white truncate">{givenName}</p>
				</div>
			</div>
		</Link>
	);
};

export default ProfilePetCard;
