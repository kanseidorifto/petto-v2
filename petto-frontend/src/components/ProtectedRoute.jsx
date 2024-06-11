import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { logout } from '../redux/auth/authSlice';
import { getMe } from '../redux/auth/authActions';

const ProtectedRoute = () => {
	const { userInfo, userToken, success, error } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		if (error || !userToken) dispatch(logout());
	}, [dispatch, error, userToken]);
	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);
	if (!userInfo && userToken) {
		return <div>Loading...</div>;
	}
	if (success && userInfo) {
		return <Outlet />;
	}
	return <Navigate to={'/sign-in'} />;
};
export default ProtectedRoute;
