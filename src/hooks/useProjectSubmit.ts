// @/hooks/useProjectSubmit.ts
import { useRouter } from "next/navigation";
import { ProjectDataType } from "@/types/project.data";
import { UiProjectFormDataType, transformImagesToServer } from "@/types/project.ui";
import { uploadToCloudinary } from "@/utils/cloudinary";

export function useProjectSubmit(mode: "create" | "edit", id: string) {
	const router = useRouter();

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		formData: UiProjectFormDataType
	) => {
		e.preventDefault();

		let currentId = id || '';
		let metaData = {
			projectNum: formData.projectNum,
			registerDate: formData.registerDate,
			modifyDate: formData.modifyDate
		};

		try {
			// 1. 신규 생성 시 ID 우선 확보 (폴더명 등을 위해)
			if (mode === "create") {
				const createRes = await fetch('/api/projects/create', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});
				if (!createRes.ok) throw new Error('프로젝트 생성 실패');
				const result = await createRes.json();
				currentId = result.data.id;
				metaData = result.data;
			}

			// 1. 이미지 계열 (Cloudinary)
			const [titleImage, subimage, before, after] = await Promise.all([
				transformImagesToServer(formData.titleImage),
				transformImagesToServer(formData.subimage),
				transformImagesToServer(formData.imageComparison.before),
				transformImagesToServer(formData.imageComparison.after)
			]);




			// 4. 최종 데이터 결합
			const finalData: ProjectDataType = {
				...formData,
				id: currentId,
				...metaData,
				titleImage,
				subimage: subimage.filter(Boolean),
				imageComparison: {
					use: formData.imageComparison.use,
					before,
					after
				}
			};

			// 6. DB 업데이트 요청
			const updateRes = await fetch('/api/projects/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(finalData),
			});

			if (updateRes.ok) {
				alert("성공적으로 저장되었습니다.");
				router.push(`/projects/${currentId}`);
				router.refresh();
			}
		} catch (error) {
			console.error("제출 중 에러:", error);
			alert("저장 중 오류가 발생했습니다.");
		}
	};

	return { handleSubmit };
}

// 목업 파일 로컬 서버 업로드 헬퍼 함수
async function uploadMockupsToServer(files: any[], currentId: string) {
	const newFiles = files
		.filter(file => file.originFileObj)
		.map(file => file.originFileObj as File);

	if (newFiles.length > 0) {
		const uploadFormData = new FormData();
		newFiles.forEach(file => uploadFormData.append("files", file));
		uploadFormData.append('projectId', currentId);
		const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
		if (!res.ok) throw new Error("로컬 파일 업로드 실패");
	}
}