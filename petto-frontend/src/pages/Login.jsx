import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterModal from '../components/RegisterModal';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { userLogin } from '../redux/auth/authActions';

Modal.setAppElement('#root');

const Login = () => {
	const { t } = useTranslation();
	useEffect(() => {
		document.title = 'Petto - ' + t('auth.head.title');
		return () => {
			document.title = 'Petto';
		};
	}, [t]);
	const [showModal, setShowModal] = useState({ show: false });
	const { userToken, loading } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		// eslint-disable-next-line
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});

	if (userToken) {
		return <Navigate to={'/profile'} />;
	}

	const onSubmit = async (values) => {
		dispatch(userLogin(values));
	};
	const openModal = () => {
		setShowModal({ show: true });
	};

	const closeModal = () => {
		setShowModal({ show: false });
	};
	return (
		<div className="grid h-screen grid-cols-2 gap-2 p-4 max-md:flex max-md:flex-col max-md:space-y-10">
			<div className="flex flex-col my-auto space-y-1 text-center max-sm:justify-end max-sm:flex-1 sm:space-y-3 text-amber-400 text-pacifico">
				<h1 className="text-9xl max-md:text-7xl">Petto</h1>
				<p className="text-2xl max-md:text-xl">{t('auth.slogan')}</p>
			</div>
			<div className="mx-auto my-auto sm:flex-shrink">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col p-6 space-y-4 border rounded-md border-amber-500">
					<input
						{...register('email', { required: t('auth.login.email_placeholder') })}
						type="email"
						placeholder={t('auth.login.email')}
						className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					/>
					<input
						{...register('password', { required: t('auth.login.password_placeholder') })}
						type="password"
						placeholder={t('auth.login.password')}
						className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					/>
					<button
						type="submit"
						disabled={loading}
						className="p-4 text-white border rounded-md border-amber-500 bg-amber-400">
						{loading ? t('auth.loading') : t('auth.login.signin')}
					</button>
					<button
						type="button"
						onClick={openModal}
						className="p-4 mx-4 bg-white border rounded-md text-amber-500 border-amber-500">
						{t('auth.login.create_new')}
					</button>
				</form>
			</div>
			<div className="flex-1 sm:hidden"></div>
			<RegisterModal modalIsOpen={showModal} closeModal={closeModal} />
		</div>
	);
};

export default Login;
