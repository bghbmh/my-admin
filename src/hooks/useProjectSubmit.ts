// @/hooks/useProjectSubmit.ts
import { useRouter } from "next/navigation";
import { ProjectDataType } from "@/types/project.data";
import { UiProjectFormDataType, transformImagesToServer } from "@/types/project.ui";
import { projectService } from "@/services/projectService"; // 서비스 임포트

export function useProjectSubmit(mode: "create" | "edit", id: string) {
	const router = useRouter();

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		formData: UiProjectFormDataType
	) => {
		e.preventDefault();

		try {
			// 1. 이미지 계열 (Cloudinary 업로드 처리)
			const [titleImage, subimage, before, after] = await Promise.all([
				transformImagesToServer(formData.titleImage),
				transformImagesToServer(formData.subimage),
				transformImagesToServer(formData.imageComparison.before),
				transformImagesToServer(formData.imageComparison.after)
			]);

			// 2. 최종 데이터 결합
			const finalData: ProjectDataType = {
				...formData,
				//id: id, // edit 모드일 때 사용
				titleImage,
				subimage: subimage.filter(Boolean),
				imageComparison: {
					use: formData.imageComparison.use,
					before,
					after
				},
				modifyDate: [...formData.modifyDate, Date.now()] // 수정일 기록
			};

			// 3. DB 작업 (API Route 대신 projectService 직접 호출)
			if (mode === "edit") {
				await projectService.updateProject(id, finalData);
				alert("성공적으로 수정되었습니다.");
			} else {
				// create 모드일 때 (ID가 없다면 Supabase가 자동생성하게 하거나 logic 추가)
				const { id: newId } = await projectService.createProject(finalData);
				alert("성공적으로 등록되었습니다.");
				router.push(`/projects/${newId}`); // 새로 생성된 ID로 이동
				return;
			}

			router.push(`/projects/${id}`);
			router.refresh(); // 최신 데이터 반영
		} catch (error: any) {
			let finalMessage = error.message;

			try {
				// 1. 에러 메시지가 JSON 형태인지 확인 시도
				const errorData = JSON.parse(error.message);

				// 2. JSON이 맞다면 커스텀 데이터 활용
				if (errorData.user === "guest") {
					finalMessage = `[권한 제한] ${errorData.msg}`;
				} else {
					finalMessage = errorData.msg;
				}
			} catch (e) {
				// 3. JSON.parse에서 에러가 났다면 일반 텍스트 에러임
				// 이때는 아무 처리를 하지 않고 원래의 error.message를 사용합니다.
				console.log("일반 텍스트 에러입니다.");
			}

			alert(finalMessage);
		}
	};

	return { handleSubmit };
}