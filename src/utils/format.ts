// utils/format.ts
export const getImageUrl = (url: string) => {
	if (!url) return '';
	return url.startsWith('http') ? url : `/uploads/${url}`;
};
