import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PetPopup = ({ petId, openEditPet, deletePet, own }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<div className="flex flex-col border-2 divide-y rounded-md text-violet-700 border-violet-700 bg-violet-200 divide-violet-700 hover:[&_>_*]:bg-violet-300 hover:[&_>_*]:rounded-md first:hover:[&_>_*]:rounded-b-none last:hover:[&_>_*]:rounded-t-none">
			<button onClick={() => navigate(`/pets/${petId}`)} className="p-2 text-sm leading-none">
				{t('pets.popup.view_profile')}	</button>
			{own && (
				<button onClick={() => openEditPet(petId)} className="p-2 text-sm leading-none">
					{t('pets.popup.edit')}	</button>
			)}
			{own && (
				<button onClick={() => deletePet(petId)} className="p-2 text-sm leading-none text-red-700">
					{t('pets.popup.remove')}	</button>
			)}
		</div>
	);
};

export default PetPopup;
