
import { useRouter } from "next/navigation";
import { useState } from "react";

import { projectService } from "@/services/projectService";

export function useProjectDelete() {

	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleProjectDelete = async (ids: string[], onSuccess?: () => void) => {
		if (ids.length === 0) return;
		if (!confirm("정말 삭제하시겠습니까?")) return;

		setIsDeleting(true);

		// 1. 서버에 삭제 요청 보내기 (예시 URL, 실제 API 엔드포인트로 변경 필요)
		try {
			// 🎯 API 대신 서비스를 직접 호출합니다!
			await projectService.deleteProjects(ids);

			alert("성공적으로 삭제되었습니다. ✨");

			if (onSuccess) onSuccess();
			router.refresh(); // 목록 갱신

		} catch (error: any) {
			let finalMessage = "삭제에 실패했습니다.";

			try {
				// 우리가 정의한 JSON 에러 메시지인지 확인
				const errorData = JSON.parse(error.message);
				if (errorData.user === "guest") {
					finalMessage = `🚫 [권한 제한] ${errorData.msg}`;
				} else {
					finalMessage = errorData.msg;
				}
			} catch (e) {
				finalMessage = error.message || finalMessage;
			}

			alert(finalMessage);

		} finally {
			// 5. 성공/실패 여부와 상관없이 로딩 종료
			setIsDeleting(false);
		}

	};

	return { isDeleting, handleProjectDelete };

}