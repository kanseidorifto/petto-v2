import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import SidebarMain from '../components/SidebarMain';
import RequestListSidebar from '../components/Friends/RequestListSidebar';

const FriendListLayout = () => {
	return (
		<div>
			<Header />
			<div className="container flex gap-4 mx-auto my-4 max-md:px-4 max-md:flex-col-reverse">
				<div className="max-md:hidden">
					<SidebarMain />
				</div>
				<main className="w-full space-y-4">
					<Outlet />
				</main>
				<div>
					<RequestListSidebar />
				</div>
			</div>
		</div>
	);
};

export default FriendListLayout;
