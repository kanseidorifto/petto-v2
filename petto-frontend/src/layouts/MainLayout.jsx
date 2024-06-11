import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import SidebarMain from '../components/SidebarMain';
import RecognizePostModal from '../components/Post/RecognizePostModal';

const MainLayout = () => {
	return (
		<div>
			<Header />
			<div className="container flex max-md:px-4 max-md:flex-col mx-auto my-4 gap-4">
				<div className="max-md:hidden">
					<SidebarMain />
				</div>
				<main className="w-full space-y-4">
					<Outlet />
				</main>
			</div>
			<RecognizePostModal modalKey="recognizeModal" />
		</div>
	);
};

export default MainLayout;
