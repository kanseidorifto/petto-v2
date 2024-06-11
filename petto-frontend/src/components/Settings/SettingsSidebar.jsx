import { NavLink } from 'react-router-dom';

const options = [
	{
		label: 'Редагувати профіль',
		href: '/settings/profile',
	},
	// {
	// 	label: 'Безпека',
	// 	href: '/settings/security',
	// },
	{
		label: 'Вийти з облікового запису',
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
	return (
		<aside className="inline-block w-full lg:w-64 text-white rounded-md bg-violet-400">
			<nav>
				<ul className="p-3 space-y-3 text-base leading-none">
					{options.map((option, index) => (
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
