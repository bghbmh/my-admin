
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useProjectDelete() {

	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleProjectDelete = async (ids: string[], onSuccess?: () => void) => {
		if (ids.length === 0) return;
		if (!confirm("정말 삭제하시겠습니까?")) return;

		setIsDeleting(true);

		// 1. 서버에 삭제 요청 보내기 (예시 URL, 실제 API 엔드포인트로 변경 필요)
		try {
			// 1. 서버에 삭제 요청 (await로 결과가 올 때까지 대기)
			const response = await fetch(`/api/projects/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ids }),
			});

			// 2. 응답 결과 처리
			if (response.ok) {
				alert("프로젝트가 삭제되었습니다.");

				if (onSuccess) onSuccess(); // 클라이언트 상태 초기화 (체크박스 비우기 등)

				console.log("onSuccess 콜백 실행됨", ids);

				// 3. 서버 데이터 갱신
				router.refresh();
			} else {
				// 서버에서 에러 메시지를 보냈다면 출력
				const errorData = await response.json();
				alert(errorData.message || "삭제에 실패했습니다. 다시 시도해주세요.");
			}

		} catch (error) {
			// 4. 네트워크 에러 등 예외 처리
			console.error("삭제 중 오류 발생:", error);
			alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");

		} finally {
			// 5. 성공/실패 여부와 상관없이 로딩 종료
			setIsDeleting(false);
		}

	};

	return { isDeleting, handleProjectDelete };

}