import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/auth/authActions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ modalIsOpen, afterOpenModal, closeModal }) => {
	const { loading, userInfo, error, success } = useSelector((state) => state.auth);
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
			alert('Password mismatch');
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
					<p className="text-2xl align-middle text-amber-500">Реєстрація</p>
					<button type="button" onClick={closeModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
					<input
						{...register('givenName', { required: "Вкажіть ім'я" })}
						type="text"
						placeholder="Ім'я"
						className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					/>
					<input
						{...register('surname', { required: 'Вкажіть прізвище' })}
						type="text"
						placeholder="Прізвище"
						className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
					/>
				</div>
				<input
					{...register('email', { required: 'Вкажіть електронну пошту' })}
					type="email"
					placeholder="Електронна пошта"
					className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
				/>
				<input
					{...register('password', { required: 'Вкажіть пароль' })}
					type="password"
					placeholder="Пароль"
					className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
				/>
				<input
					{...register('repeatPassword', { required: 'Вкажіть повторно пароль' })}
					type="password"
					placeholder="Повторіть пароль"
					className="p-4 border rounded-md border-amber-500 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
				/>
				<button
					type="submit"
					disabled={loading}
					className="p-4 text-white border rounded-md border-amber-500 bg-amber-400">
					{loading ? 'Зачекайте...' : 'Зареєструватись'}
				</button>
			</form>
			{/* </div> */}
		</Modal>
	);
};

export default RegisterModal;
