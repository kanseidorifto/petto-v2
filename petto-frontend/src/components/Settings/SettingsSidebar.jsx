import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const options = (t) => [
	{
		label: t('preferences.options.edit_profile'),
		href: '/settings/profile',
	},
	// {
	// 	label: 'Безпека',
	// 	href: '/settings/security',
	// },
	{
		label: t('preferences.options.sign_out'),
		href: '/settings/sign-out',
	},
];

const Option = ({ label, href }) => {
	return (
		<NavLink
			to={href}
			end
			className={({ isActive }) => {
				return (
					'flex items-center px-2 py-1 space-x-2 rounded-md hover:bg-violet-300/50 ease-out delay-75 transition' +
					(isActive ? ' bg-violet-300/50' : ' ')
				);
			}}>
			<span className="">{label}</span>
		</NavLink>
	);
};

const RequestListSidebar = () => {
	const { t } = useTranslation();
	return (
		<aside className="inline-block w-full text-white rounded-md lg:w-64 bg-violet-400">
			<nav>
				<ul className="p-3 space-y-3 text-base leading-none">
					{options(t).map((option, index) => (
						<li key={index}>
							<Option {...option} />
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default RequestListSidebar;
