export const dataUrlToFile = async (url, fileName, mimeType) => {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();

	return new File([buffer], fileName, { type: mimeType });
};
