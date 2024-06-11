import { Outlet } from 'react-router-dom';

import Header from '../components/Header';

const HeaderLayout = () => {
	return (
		<div>
			<Header />
			<div>
				<Outlet />
			</div>
		</div>
	);
};

export default HeaderLayout;
