import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../redux/auth/authSlice';
import { baseApi } from '../../services/baseService';

const LeavePreferences = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = () => {
		if (confirm(t('preferences.confirmLeave'))) {
			dispatch(baseApi.util.resetApiState());
			dispatch(logout());
			navigate('/sign-in');
		}
	};

	return (
		<main className="px-6 py-4 text-white rounded-md bg-violet-400">
			<div className="flex flex-col">
				<div className="grid items-center justify-center grid-cols-1 gap-6 p-3 justify-items-center sm:grid-cols-3">
					<div className="self-center sm:text-right">
						<p>{t('preferences.logout_p')}</p>
					</div>
					<div className="col-span-2">
						<button
							onClick={handleLogout}
							className="p-3 min-w-[200px] leading-none bg-amber-600 hover:bg-amber-500 transition-colors rounded-xl">
							{t('preferences.logout')}
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default LeavePreferences;
