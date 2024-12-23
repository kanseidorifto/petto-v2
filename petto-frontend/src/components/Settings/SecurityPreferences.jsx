import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SecurityPreferences = () => {
	const { t } = useTranslation();
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
			breed: '',
			age: '',
			bio: '',
		},
		mode: 'onSubmit',
		// shouldUseNativeValidation: true,
	});
	return (
		<main className="px-6 py-4 text-white rounded-md bg-violet-400">
			<div className="flex flex-col">
				<div className="grid grid-cols-3 gap-6 p-3">
					<div className="self-center text-right">
						<p>{t('preferences.security.old_password')}</p>
					</div>
					<div className="col-span-2">
						<input
							type="text"
							{...register('oldPassword', {
								required: t('preferences.security.old_password_placeholder'),
							})}
							className="px-2 py-2 bg-transparent border rounded-md border-violet-700 focus:outline-none focus:ring-violet-800 focus:border-violet-800"
						/>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 p-3">
					<div className="self-center text-right">
						<p>{t('preferences.security.new_password')}</p>
					</div>
					<div className="col-span-2">
						<input
							type="text"
							{...register('password', {
								required: t('preferences.security.new_password_placeholder'),
							})}
							className="px-2 py-2 bg-transparent border rounded-md border-violet-700 focus:outline-none focus:ring-violet-800 focus:border-violet-800"
						/>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 p-3">
					<div className="self-center text-right">
						<p>{t('preferences.security.repeat_password')}</p>
					</div>
					<div className="col-span-2">
						<input
							type="text"
							{...register('repeatPassword', {
								required: t('preferences.security.repeat_password_placeholder'),
							})}
							className="px-2 py-2 bg-transparent border rounded-md border-violet-700 focus:outline-none focus:ring-violet-800 focus:border-violet-800"
						/>
					</div>
				</div>
				<div className="p-3 text-center">
					<button className="p-3 min-w-[200px] leading-none bg-violet-500 rounded-xl">
						{t('preferences.save_changes')}
					</button>
				</div>
			</div>
		</main>
	);
};

export default SecurityPreferences;
