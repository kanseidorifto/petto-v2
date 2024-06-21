import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { file2Base64 } from '../../utils/file2Base64';

Modal.setAppElement('#root');

const ChangePhotoModal = ({ modalIsOpen, afterOpenModal, closeModal, label, aspectRatio }) => {
	// ref of the file input
	const fileRef = useRef();

	// the selected image
	const [uploaded, setUploaded] = useState(null);

	// the resulting cropped image
	// const [cropped, setCropped] = useState(null);

	// the reference of cropper element
	const cropperRef = useRef();

	const onFileInputChange = (e) => {
		const file = e.target?.files?.[0];
		if (file) {
			file2Base64(file).then((base64) => {
				setUploaded(base64);
			});
		}
	};

	const crop = () => {
		const imageElement = cropperRef?.current;
		const cropper = imageElement?.cropper;
		return cropper.getCroppedCanvas().toDataURL();
	};

	const closeCurrentModal = () => {
		setUploaded(null);
		// setCropped(null);
		closeModal();
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		modalIsOpen.setResult(crop);
		closeCurrentModal();
	};

	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={modalIsOpen.show}
			onAfterOpen={() => (document.body.style.overflow = 'hidden')}
			onAfterClose={() => (document.body.style.overflow = 'unset')}
			onRequestClose={closeCurrentModal}
			className={'mx-auto w-fit my-auto p-4'}
			contentLabel="Fill create pet modal">
			<form
				onSubmit={onSubmit}
				className="flex bg-white flex-col p-6 space-y-4 border rounded-md border-amber-500 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex items-center justify-between space-x-1">
					<p className="text-xl text-amber-500">{modalIsOpen.label}</p>
					<button type="button" onClick={closeCurrentModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<div className="flex flex-col items-center space-y-2 text-center">
					<input
						type="file"
						style={{ display: 'none' }}
						ref={fileRef}
						onChange={onFileInputChange}
						accept="image/png,image/jpeg,image/gif"
					/>
					{uploaded ? (
						<div>
							<Cropper
								src={uploaded}
								className="max-w-[20rem] md:max-w-[24rem] xl:max-w-[32rem] 2xl:max-w-[60rem]"
								// style={{ maxHeight: '80vh', width: 'auto' }}
								autoCropArea={1}
								responsive={true}
								aspectRatio={modalIsOpen.aspectRatio}
								viewMode={2}
								guides={false}
								ref={cropperRef}
							/>
							<button type="button" onClick={() => fileRef.current?.click()}>
								Змінити
							</button>
						</div>
					) : (
						<>
							<button
								type="button"
								onClick={() => fileRef.current?.click()}
								className="w-48 h-48 transition-all bg-cover border rounded-md brightness-90 border-violet-500 bg-violet-300 hover:bg-violet-300/50">
								<span className="text-violet-700">Додати</span>
							</button>
						</>
					)}
				</div>
				<button
					type="submit"
					className="p-2.5 text-white font-semibold leading-none border rounded-xl border-violet-700 bg-violet-600">
					Підтвердити
				</button>
			</form>
		</Modal>
	);
};

export default ChangePhotoModal;
