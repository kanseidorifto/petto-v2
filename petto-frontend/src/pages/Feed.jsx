import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FeedPostList from '../components/Post/FeedPostList';
import AllPostList from '../components/Post/AllPostList';

const options = (t) => [
	{
		label: t('feed.options.following'),
		href: '/feed',
	},
	{
		label: t('feed.options.popular'),
		href: '/feed/popular',
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

const Feed = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState(0);
	useEffect(() => {
		document.title = 'Petto - ' + t('feed.head.title');
		return () => {
			document.title = 'Petto';
		};
	}, []);
	return (
		<div className="flex gap-4 max-lg:flex-col-reverse ">
			<main className="flex-1 space-y-4">
				{activeTab === 0 && <FeedPostList />}
				{activeTab === 1 && <AllPostList />}
			</main>
			<div>
				<aside className="inline-block w-full text-white rounded-md lg:w-64 bg-violet-400">
					<nav>
						<ul className="p-3 space-y-3 text-base leading-none">
							{options(t).map((option, index) => (
								<li key={index} onClick={() => setActiveTab(index)}>
									<Option {...option} />
								</li>
							))}
						</ul>
					</nav>
				</aside>
			</div>
		</div>
	);
};

export default Feed;
