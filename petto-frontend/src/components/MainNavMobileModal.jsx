import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

import 'cropperjs/dist/cropper.css';

import useModal from '../hooks/useModal';
import SidebarMain from './SidebarMain';

Modal.setAppElement('#root');

const MainNavMobileModal = ({ modalKey }) => {
	const { t } = useTranslation();
	const { isModalOpen, close } = useModal('mobileNavModal');

	const closeCurrentModal = () => {
		close();
	};

	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={isModalOpen}
			onAfterOpen={() => (document.body.style.overflow = 'hidden')}
			onAfterClose={() => (document.body.style.overflow = 'unset')}
			onRequestClose={close}
			className={'mx-auto w-fit my-auto p-4'}
			contentLabel="Mobile nav modal">
			<div className="flex bg-violet-400 shadow-xl flex-col py-4 px-2 border rounded-md border-violet-700 z-20 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex items-center justify-between px-4 py-2 align-middle">
					<p className="text-xl font-semibold leading-none text-white">{t('mobilenavbar.title')}</p>
					<button type="button" onClick={closeCurrentModal}>
						<XMarkIcon className="w-6 h-6 text-white" />
					</button>
				</div>
				<SidebarMain onClick={() => close()} />
			</div>
		</Modal>
	);
};

export default MainNavMobileModal;
