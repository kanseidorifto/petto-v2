import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const options = (t) => [
	{
		label: t('friends.options.friends'),
		href: '/friends',
	},
	{
		label: t('friends.options.requests'),
		href: '/friends/requests',
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
		<aside className="inline-block w-full text-white rounded-md md:w-64 bg-violet-400">
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
