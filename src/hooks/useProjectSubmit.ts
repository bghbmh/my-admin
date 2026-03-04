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

			// --- [수정] 과거에 쓰시던 ID 및 타임스탬프 생성 로직 ---
			const timestamp = Date.now();
			const meta = {
				id: id,
				projectNum: (formData as any).projectNum, // 기존 번호 유지
				registerDate: (formData as any).registerDate
			};

			console.log("🚀 mode??? === ", mode, formData);
			if (mode === "create") {
				meta.id = 'bmh' + timestamp; // 과거 방식 그대로,
				meta.projectNum = timestamp; // 기존 번호 유지
				meta.registerDate = timestamp;
			}

			// 2. 최종 데이터 결합
			const finalData: ProjectDataType = {
				...formData,
				...meta,
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

				console.log("🚀 mode === ", mode, finalData);
				const { id: newId } = await projectService.createProject(finalData);
				alert("성공적으로 등록되었습니다.");
				router.push(`/projects/${newId}`); // 새로 생성된 ID로 이동
				return;
			}

			router.push(`/projects/${id}`);
			router.refresh(); // 최신 데이터 반영
		} catch (error: any) {
			let finalMessage = error.message;

			// 1. Supabase 에러 객체 자체에 메시지가 있는 경우 (RLS 에러 등)
			if (error.message && typeof error.message === 'string') {
				try {
					// 메시지가 JSON 형태일 때만 파싱 시도
					if (error.message.startsWith('{')) {
						const errorData = JSON.parse(error.message);
						finalMessage = errorData.user === "guest"
							? `[권한 제한] ${errorData.msg}`
							: errorData.msg;
					} else {
						// JSON이 아니면 (예: "new row violates RLS...") 그대로 사용
						finalMessage = error.message;
					}
				} catch (e) {
					finalMessage = error.message;
				}
			}

			console.error("상세 에러 로그:", error); // 브라우저 콘솔에서 진짜 원인 확인용
			alert(finalMessage);
		}
	};

	return { handleSubmit };
}