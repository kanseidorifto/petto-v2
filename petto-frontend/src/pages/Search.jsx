import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useLazySearchUserQuery } from '../services/authService';
import { useDebounce } from '../hooks/useDebounce';

const Search = () => {
	const { t } = useTranslation();
	const [searchText, setSearchText] = useState('');
	const [activeTab, setActiveTab] = useState(0);
	const [initial, setInitial] = useState(true);
	const [searchUser, userList] = useLazySearchUserQuery();
	useEffect(() => {
		let tab;
		switch (activeTab) {
			case 0:
				tab = t('search.head.title_people');
				break;
			case 1:
				tab = t('search.head.title_pets');
				break;
			default:
				tab = '';
				break;
		}
		document.title = 'Petto - ' + t('sidenavbar.search') + ' ' + tab;
		window.scrollTo(0, 0);
		return () => {
			document.title = 'Petto';
		};
	}, [activeTab, t]);

	const debouncedRequest = useDebounce(() => {
		searchUser(searchText);
		searchText === '' ? setInitial(true) : setInitial(false);
	});

	const handleSearch = () => {
		searchUser(searchText);
	};
	return (
		<main className="rounded-md bg-violet-400">
			<div className="flex items-center px-6 py-3 space-x-1 text-white bg-violet-500 rounded-t-md">
				<MagnifyingGlassIcon className="w-6 h-6" />
				<input
					type="text"
					className="flex-1 p-1 text-base bg-transparent rounded appearance-none resize-none placeholder:text-white placeholder:font-light focus:bg-violet-300/50 focus:outline-none focus:border-none focus:ring-none"
					value={searchText}
					onChange={(e) => {
						setSearchText(e.target.value);
						debouncedRequest();
					}}
					placeholder={t('sidenavbar.search') + '...'}
				/>
				<button
					onClick={handleSearch}
					className="rounded-full leading-none font-semibold text-xs py-1.5 px-2.5 bg-amber-500">
					{t('search.find')}
				</button>
			</div>
			<div className="px-4 py-2 space-y-2 text-white">
				{false && (
					<div className="px-3 py-2 space-x-2">
						<button
							onClick={() => setActiveTab(0)}
							className={
								'px-2 py-2 border-2 hover:bg-violet-300/50 transition-all font-medium leading-none min-w-[10rem] border-violet-300 rounded-md' +
								(activeTab === 0 ? ' bg-violet-300/50' : '')
							}>
							{t('search.type.people')}
						</button>
						<button
							onClick={() => setActiveTab(1)}
							className={
								'px-2 py-2 border-2 hover:bg-violet-300/50 transition-all font-medium leading-none min-w-[10rem] border-violet-300 rounded-md' +
								(activeTab === 1 ? ' bg-violet-300/50' : '')
							}>
							{t('search.type.pets')}
						</button>
					</div>
				)}
				{!initial ? (
					!userList.isFetching ? (
						<div className="flex flex-col">
							{activeTab === 0 && userList.data?.items?.length > 0 ? (
								userList.data.items.map((user, index) => (
									<div key={index} className="flex w-full px-3 py-2">
										<div className="flex items-center space-x-3">
											<Link to={`/profile/${user.id}`}>
												<img src={user.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
											</Link>
											<div>
												<Link to={`/profile/${user.id}`}>
													<p>{user.givenName + ' ' + user.surname}</p>
												</Link>
												<Link
													to={`/profile/${user.id}`}
													className="text-neutral-300 hover:underline">
													{t('search.entry.view_profile')}{' '}
												</Link>
											</div>
										</div>
									</div>
								))
							) : (
								<p className="px-6 py-4 text-lg font-medium text-center">
									{t('search.empty_list')}
								</p>
							)}
							{activeTab === 1 &&
								new Array(10).fill(0).map((obj, index) => (
									<div key={index} className="flex w-full px-3 py-2">
										<div className="flex items-center space-x-3">
											<Link to={'/pets/1'}>
												<img
													src="https://cdn.discordapp.com/attachments/905893715170697216/1096881731530920077/image.png"
													alt="avatar"
													className="w-12 h-12 rounded-full"
												/>
											</Link>
											<div>
												<Link to={'/pets/1'}>
													<p>
														Барсик <span>(власник Андрій Іваненко)</span>
													</p>
												</Link>
												<div className="flex space-x-2">
													<Link to={'/pets/1'} className="text-neutral-300 hover:underline">
														{t('search.entry.view_profile')}{' '}
													</Link>
													<Link to={'/profile'} className="text-neutral-300 hover:underline">
														{t('search.entry.view_owner_profile')}{' '}
													</Link>
												</div>
											</div>
										</div>
									</div>
								))}
						</div>
					) : (
						<p className="px-6 py-4 text-lg font-medium text-center">{t('search.loading_list')}</p>
					)
				) : (
					<p className="px-6 py-4 text-lg font-medium text-center">
						{t('search.prompting_message')}{' '}
					</p>
				)}
			</div>
		</main>
	);
};

export default Search;
