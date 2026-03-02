// src/utils/cloudinary.ts

export const uploadToCloudinary = async (file: File): Promise<string> => {
	const cloudName = "dhym4swda";
	const uploadPreset = "my-portfolio"; // 설정하신 프리셋 이름

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset);

	try {
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || "Cloudinary 업로드 실패");
		}

		const data = await response.json();
		// 깃허브 db.json에 저장될 최종 https 주소입니다.
		return data.secure_url;

	} catch (error) {
		console.error("Cloudinary 업로드 중 오류 발생:", error);
		throw error;
	}
};