import { Navigate, Route, Routes } from 'react-router-dom';
import FriendList from '../components/Friends/FriendList';
import FriendRequestList from '../components/Friends/FriendRequestList';

const Friends = () => {
	return (
		<Routes>
			<Route path="/" element={<FriendList />} />
			<Route path="/requests" element={<FriendRequestList />} />
			<Route path="*" element={<Navigate to={'/friends'} />} />
		</Routes>
	);
};

export default Friends;
