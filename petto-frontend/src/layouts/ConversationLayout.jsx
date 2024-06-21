import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import SidebarMain from '../components/SidebarMain';

const ConversationLayout = () => {
	return (
		<div className="h-screen flex-col flex">
			<Header />
			<div className="container overflow-y-auto flex flex-1 max-md:px-4 max-md:flex-col mx-auto py-4 gap-4">
				<div className="max-md:hidden">
					<SidebarMain />
				</div>
				<main className="w-full h-full space-y-4">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default ConversationLayout;
