import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';
import Feed from './pages/Feed';
import Pets from './pages/Pets';
import PetProfile from './pages/PetProfile';
import Search from './pages/Search';
import Friends from './pages/Friends';
import FriendListLayout from './layouts/FriendListLayout';
import Settings from './pages/Settings';
import SettingsLayout from './layouts/SettingsLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import MainNavMobileModal from './components/MainNavMobileModal';
import Chats from './pages/Chats';
import Conversation from './pages/Conversation';
import { dayjsSetup } from './utils/dayJsSetup';
import ConversationLayout from './layouts/ConversationLayout';

function App() {
	dayjsSetup();
	return (
		<>
			<ToastContainer position="top-right" />
			<MainNavMobileModal modalKey="mobileNavModal" />
			<Routes>
				<Route path="/sign-in" element={<Login />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<MainLayout />}>
						<Route path="/profile" element={<Profile />} />
						<Route path="/profile/:id" element={<Profile />} />
						<Route path="/feed/*" element={<Feed />} />
						<Route path="/pets/*" element={<Pets />} />
						<Route path="/pets/:petId" element={<PetProfile />} />
						<Route path="/search" element={<Search />} />
						<Route path="/chats" element={<Chats />} />
					</Route>
					<Route element={<ConversationLayout />}>
						<Route path="/chats/:chatId" element={<Conversation />} />
					</Route>
					<Route element={<FriendListLayout />}>
						<Route path="/friends/*" element={<Friends />} />
					</Route>
					<Route element={<SettingsLayout />}>
						<Route path="/settings/*" element={<Settings />} />
					</Route>
					<Route path="*" element={<Navigate to={'/profile'} />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
