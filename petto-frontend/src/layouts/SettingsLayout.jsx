import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import SidebarMain from '../components/SidebarMain';
import SettingsSidebar from '../components/Settings/SettingsSidebar';

const SettingsLayout = () => {
	return (
		<div>
			<Header />
			<div className="container flex max-md:px-4 mx-auto my-4 gap-4">
				<div className="max-md:hidden">
					<SidebarMain />
				</div>
				<div className="flex flex-1 gap-4 max-lg:flex-col-reverse justify-end">
					<main className="w-full space-y-4">
						<Outlet />
					</main>
					<div>
						<SettingsSidebar />
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsLayout;
