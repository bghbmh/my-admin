import { useRouter } from "next/navigation";
import { UploadFile } from 'antd';
import { ProjectDataType } from "@/types/project.data";
import { uploadToCloudinary } from "@/utils/cloudinary";

// @/hooks/useProjectSubmit.ts

export function useProjectSubmit(mode: "create" | "edit", id: string) {
	const router = useRouter();

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		formData: ProjectDataType,
		titleImageFile: any[],
		imageFileList: any[],
		mockupFileList: any[] // 여기서 각 file 객체에 label이 포함되어 있어야 합니다.
	) => {
		e.preventDefault();

		let currentId = id || '';
		let metaData = {
			projectNum: formData.projectNum,
			registerDate: formData.registerDate,
			modifyDate: formData.modifyDate
		};

		try {
			// 1. 신규 생성 시 ID 확보
			if (mode === "create") {
				const createRes = await fetch('/api/projects/create', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});
				if (!createRes.ok) throw new Error('프로젝트 생성 실패');
				const result = await createRes.json();
				currentId = result.data.id;
				metaData = {
					projectNum: result.data.projectNum,
					registerDate: result.data.registerDate,
					modifyDate: result.data.modifyDate
				};
			}

			// 2. 데이터 매핑 함수 (라벨 및 URL 확정)
			const mapToDatabaseFormat = async (file: any, folderName: 'images' | 'files') => {
				const isNew = !!file.originFileObj;
				let finalUrl = "";

				if (isNew) {
					if (folderName === 'images') {
						finalUrl = await uploadToCloudinary(file.originFileObj as File);
					} else {
						finalUrl = `${currentId}/files/${file.name}`;
					}
				} else {
					const originalUrl = file.url || "";
					finalUrl = originalUrl.replace(/^\/uploads\//, "");
				}

				// 결과 반환 (목업일 경우 라벨을 명시적으로 포함)
				const result: any = {
					alt: file.alt || file.name,
					name: file.name,
					size: file.size || 0,
					type: file.type || (isNew ? file.originFileObj.type : ""),
					lastModified: isNew ? file.originFileObj.lastModified : (file.lastModified || null),
					url: finalUrl,
				};

				if (folderName === 'files') {
					// 사용자가 입력한 label이 없으면 name을 기본값으로 사용
					result.label = file.label || file.name;
				}

				return result;
			};

			// 3. 모든 파일의 데이터 포맷팅 수행 (비동기)
			const titleImage = titleImageFile.length > 0
				? await mapToDatabaseFormat(titleImageFile[0], 'images') : null;

			const subimage = await Promise.all(
				(imageFileList || []).map(file => mapToDatabaseFormat(file, 'images'))
			);

			// ★ 여기서 각 목업 파일의 label이 포함된 데이터가 생성됩니다.
			const mockup = await Promise.all(
				(mockupFileList || []).map(file => mapToDatabaseFormat(file, 'files'))
			);

			// 4. 로컬 서버에 실제 파일 업로드 (목업 전용)
			const uploadMockupsToServer = async (files: any[]) => {
				const newFiles = files
					.filter(file => !file.url && file.originFileObj)
					.map(file => file.originFileObj as File);

				if (newFiles.length > 0) {
					const uploadFormData = new FormData();
					newFiles.forEach(file => uploadFormData.append("files", file));
					uploadFormData.append('projectId', currentId);
					const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
					if (!res.ok) throw new Error("로컬 파일 업로드 실패");
				}
			};

			await uploadMockupsToServer(mockupFileList);

			// 5. 최종 데이터 구성 및 DB 업데이트
			const finalData = {
				...formData,
				id: currentId,
				...metaData,
				titleImage,
				subimage,
				mockup, // 라벨이 포함된 배열
			};

			const updateRes = await fetch('/api/projects/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(finalData),
			});

			if (updateRes.ok) {
				router.push(`/projects/${currentId}`);
				router.refresh();
			}
		} catch (error) {
			console.error("제출 중 에러:", error);
			alert("저장에 실패했습니다.");
		}
	};

	return { handleSubmit };
}