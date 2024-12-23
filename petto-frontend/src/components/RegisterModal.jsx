import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/auth/authActions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterModal = ({ modalIsOpen, afterOpenModal, closeModal }) => {
	const { t } = useTranslation();
	const { loading, userInfo, success } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		reset,
		// setError,
		// eslint-disable-next-line
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			givenName: '',
			surname: '',
			email: '',
			password: '',
			repeatPassword: '',
		},
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});
	const closeOrderModal = () => {
		closeModal();
		reset();
	};

	const onSubmit = async (values) => {
		console.log(values);
		if (values.password !== values.repeatPassword) {
			alert(t('auth.register.passwordMismatchAlert'));
			return;
		}
		values.email = values.email.toLowerCase();
		dispatch(registerUser(values));
	};

	useEffect(() => {
		// redirect user to login page if registration was successful
		if (success) closeOrderModal();
		// redirect authenticated user to profile screen
		if (userInfo) navigate('/profile');
	}, [navigate, userInfo, success]);
	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={modalIsOpen.show}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeOrderModal}
			className={'mx-auto w-fit flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} //absolute inset-0
			contentLabel="Fill register modal">
			{/* <div className="p-6 bg-white border border-black w-fit rounded-3xl  &[ReactModal__Overlay--after-open:translate-y-0]"> */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex bg-white flex-col p-6 space-y-4 border rounded-md border-amber-500 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex justify-between">
					<p className="text-2xl align-middle text-amber-500">{t('auth.register.title')}</p>
					<button type="button" onClick={closeModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
					<input
						{...register('givenName', { required: t('auth.register.givenName_placeholder') })}
						type="text"
						placeholder={t('auth.register.givenName')}
						className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					/>
					<input
						{...register('surname', { required: t('auth.register.surname_placeholder') })}
						type="text"
						placeholder={t('auth.register.surname')}
						className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					/>
				</div>
				<input
					{...register('email', { required: t('auth.register.email_placeholder') })}
					type="email"
					placeholder={t('auth.register.email')}
					className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
				/>
				<input
					{...register('password', { required: t('auth.register.password_placeholder') })}
					type="password"
					placeholder={t('auth.register.password')}
					className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
				/>
				<input
					{...register('repeatPassword', { required: t('auth.register.password_repeat_placeholder') })}
					type="password"
					placeholder={t('auth.register.password_repeat')}
					className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
				/>
				<button
					type="submit"
					disabled={loading}
					className="p-4 text-white border rounded-md border-amber-500 bg-amber-400">
					{loading ? t('auth.register.loading') : t('auth.register.signup')}
				</button>
			</form>
			{/* </div> */}
		</Modal>
	);
};

export default RegisterModal;
