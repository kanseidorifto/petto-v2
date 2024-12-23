import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ProfilePreferences from '../components/Settings/ProfilePreferences';
import SecurityPreferences from '../components/Settings/SecurityPreferences';
import LeavePreferences from '../components/Settings/LeavePreferences';

const Settings = () => {
	const { t } = useTranslation();
	useEffect(() => {
		document.title = 'Petto - '+t('preferences.head.title');
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, [t]);
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
