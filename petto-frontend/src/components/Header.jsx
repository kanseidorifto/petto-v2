import { Bars3Icon } from '@heroicons/react/24/outline';
import useModal from '../hooks/useModal';

const Header = () => {
	const { open: openBurger } = useModal('mobileNavModal');

	return (
		<header className="z-50 w-full bg-violet-500 max-md:sticky max-md:top-0">
			<div className="container flex justify-between px-4 py-3 mx-auto">
				<span className="text-2xl leading-none text-pacifico text-amber-400">Petto</span>
				{openBurger && (
					<button
						type="button"
						onClick={() => openBurger()}
						className="align-middle transition-colors rounded md:hidden justify-self-end focus:outline-none hover:bg-amber-400/30">
						<Bars3Icon className="w-8 h-8 text-amber-400" />
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
