import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePreferences from '../components/Settings/ProfilePreferences';
import SecurityPreferences from '../components/Settings/SecurityPreferences';
import LeavePreferences from '../components/Settings/LeavePreferences';

const Settings = () => {
	useEffect(() => {
		document.title = 'Petto - Налаштування';
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, []);
	return (
		<Routes>
			<Route path="/profile" element={<ProfilePreferences />} />
			<Route path="/security" element={<SecurityPreferences />} />
			<Route path="/sign-out" element={<LeavePreferences />} />
			<Route path="*" element={<Navigate to={'/settings/profile'} />} />
		</Routes>
	);
};

export default Settings;
