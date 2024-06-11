import axios from 'axios';

const recognitionAPIURL = process.env.VITE_APP_RECOGNITION_API_URL; //'/api';

export const recognizePet = async (formData) => {
	const response = await axios.post(`${recognitionAPIURL}/recognize`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};
