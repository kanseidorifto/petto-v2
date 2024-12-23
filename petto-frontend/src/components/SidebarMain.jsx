import {
	UserCircleIcon,
	RectangleStackIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
	ChatBubbleLeftIcon,
	Cog8ToothIcon,
	SparklesIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const options = (t) => [
	{
		icon: <UserCircleIcon className="w-6 h-6" />,
		label: t('sidenavbar.profile'),
		href: '/profile',
	},
	{
		icon: <RectangleStackIcon className="w-6 h-6" />,
		label: t('sidenavbar.feed'),
		href: '/feed',
	},
	{
		icon: <MagnifyingGlassIcon className="w-6 h-6" />,
		label: t('sidenavbar.search'),
		href: '/search',
	},
	{
		icon: <ChatBubbleLeftIcon className="w-6 h-6" />,
		label: t('sidenavbar.messages'),
		href: '/chats',
	},
	{
		icon: <UserGroupIcon className="w-6 h-6" />,
		label: t('sidenavbar.friends'),
		href: '/friends',
	},
	{
		icon: <SparklesIcon className="w-6 h-6" />,
		label: t('sidenavbar.pets'),
		href: '/pets',
	},
	{
		icon: <Cog8ToothIcon className="w-6 h-6" />,
		label: t('sidenavbar.preferences'),
		href: '/settings',
	},
];

const Option = ({ icon, label, href }) => {
	return (
		<NavLink
			to={href}
			className={({ isActive }) => {
				return (
					'flex items-center px-2 py-1 space-x-2 rounded-md hover:bg-violet-300/50 ease-out delay-75 transition' +
					(isActive ? ' bg-violet-300/50' : ' ')
				);
			}}>
			{icon}
			<span className="">{label}</span>
		</NavLink>
	);
};

const SidebarMain = ({ onClick }) => {
	const { t } = useTranslation();
	return (
		<aside className="inline-block w-64 text-white rounded-md bg-violet-400">
			<nav>
				<ul className="p-3 space-y-3 text-base leading-none">
					{options(t).map((option, index) => (
						<li key={index} onClick={() => (onClick ? onClick(option) : {})}>
							<Option {...option} />
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default SidebarMain;
