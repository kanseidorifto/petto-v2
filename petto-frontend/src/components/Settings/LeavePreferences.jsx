import { useDispatch } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import { baseApi } from '../../services/baseService';
import { useNavigate } from 'react-router-dom';

const LeavePreferences = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = () => {
		if (confirm('Вийти з облікового запису?')) {
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
						<p>Вийти з облікового запису?</p>
					</div>
					<div className="col-span-2">
						<button
							onClick={handleLogout}
							className="p-3 min-w-[200px] leading-none bg-amber-600 hover:bg-amber-500 transition-colors rounded-xl">
							Вихід
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default LeavePreferences;
