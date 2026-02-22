
import { useRouter } from "next/navigation";
import { UploadFile } from 'antd';
import { ProjectDataType, MockupFileType } from "@/types/project.data";

export function useProjectSubmit(mode: "create" | "edit", id: string) {
	const router = useRouter();


	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		formData: ProjectDataType,
		imageFileList: any[],
		mockupFileList: any[]
	) => {
		e.preventDefault();

		let currentId = id || ''; // 기존 id (edit일 때)
		let metaData = {
			projectNum: formData.projectNum,
			registerDate: formData.registerDate,
			modifyDate: formData.modifyDate
		};

		try {


			// 2. 신규 생성인 경우, 프로젝트 생성 API 호출하여 ID 받기
			if (mode === "create") {
				const createRes = await fetch('/api/projects/create', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				});
				if (!createRes.ok) throw new Error('프로젝트 생성 실패');

				const result = await createRes.json();
				currentId = result.data.id; // 새로 생성된 프로젝트 ID
				metaData = {
					projectNum: result.data.projectNum,
					registerDate: result.data.registerDate,
					modifyDate: result.data.modifyDate
				}

				console.log("프로젝트 create ?? :", result, currentId);

				// ID가 없을 경우를 대비한 체크
				if (!result.data.id) {
					alert("서버에서 ID를 생성하지 못했습니다. 응답 구조를 확인하세요.");
					return; // 이후 로직(파일 업로드 등) 진행 방지
				}
			}

			console.log("프로젝트 ID:", currentId);

			// 2. 공통 파일 업로드 로직 (신규 파일만 선별하여 업로드)
			const uploadNewFiles = async (files: UploadFile[]) => {
				// 실제 파일 객체(originFileObj)가 있는 것만 업로드 대상
				const newFiles = files
					.filter(file => !file.url && file.originFileObj)
					.map(file => file.originFileObj as File);

				if (newFiles.length > 0) {
					const uploadFormData = new FormData();
					newFiles.forEach(file => uploadFormData.append("files", file));
					uploadFormData.append('projectId', currentId);

					const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
					if (!res.ok) throw new Error("서버 파일 저장 실패");
				}
			};

			// 공통 데이터 정제 로직 추출
			const mapToDatabaseFormat = (file: any, folderName: 'images' | 'files') => {
				// 1. 신규 파일 여부 판별 (Ant Design Upload 구조 활용)
				const isNew = !!file.originFileObj;

				console.log(`파일 처리 - ${isNew ? "신규" : "기존"}:  ${isNew}`);

				// 2. 확장자 추출 시 안전한 처리
				// 파일명에 점(.)이 없는 경우를 대비해 기본값 설정
				const fileName = file.name || "unknown";
				const fileParts = fileName.split('.');
				const ext = fileParts.length > 1 ? `.${fileParts.pop()?.toLowerCase()}` : "";

				// 이미지 확장자 체크 (이 로직은 서버에서도 동일하게 수행되어야 경로가 일치함)
				const folder = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
					? 'images'
					: 'files';

				// 3. 기본 데이터 구조 형성
				let data: any = {
					alt: file.alt || file.name,
					name: file.name,
					size: file.size || 0,
					// 신규 파일이면 실제 파일 객체에서 타입을 가져오고, 아니면 기존 속성 사용
					type: file.type || (isNew ? file.originFileObj.type : ""),
					lastModified: isNew
						? (file.originFileObj as File).lastModified
						: (file.lastModified || null),
					// 서버에서 생성할 수 있도록 신규 파일은 빈 값 전송
					webUrl: isNew
						? `${currentId}/${folder}/${file.name}` // id 대신 currentId 사용
						: (file.url ? file.url.replace('/uploads/', '') : (file.webUrl || '')),
				};

				// 4. 일반 파일(목업 등)일 때만 label 추가
				if (folderName === 'files') {
					data.label = file.label || file.name;
				}

				return data;
			};

			await Promise.all([
				uploadNewFiles(imageFileList),
				uploadNewFiles(mockupFileList)
			]);

			// ★ formData와 합치기
			const finalData = {
				...formData,
				id: currentId,
				...metaData,
				subimage: (imageFileList || []).map(file => mapToDatabaseFormat(file, 'images')),
				mockup: (mockupFileList || []).map(file => mapToDatabaseFormat(file, 'files')),

			};

			console.log("ProjectForm - 제출할 데이터:", finalData);

			// 상세 데이터 저장
			const updateRes = await fetch('/api/projects/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(finalData),
			});

			if (!updateRes.ok) {
				throw new Error('프로젝트 업데이트 실패');
			}

			// 3. 프로젝트 상세 페이지로 이동
			router.push(`/projects/${currentId}`);
			router.refresh(); // 최신 데이터를 서버에서 다시 불러오도록 갱신
		} catch (error) {
			console.error("ProjectForm -  실패:", error);
			alert("파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
		}
	};

	return { handleSubmit };

}