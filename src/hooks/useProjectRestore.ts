import { useRouter } from "next/navigation";
import { useState } from "react";

export function useProjectRestore() {

	const router = useRouter();
	const [isRestoring, setIsRestoring] = useState(false);

	const handleProjectRestore = async (ids: string[], onSuccess?: () => void) => {
		if (ids.length === 0) return;
		if (!confirm("선택한 프로젝트를 복원하시겠습니까?")) return;

		setIsRestoring(true);

		try {
			const response = await fetch("/api/projects/restore", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids }),
			});

			if (response.ok) {
				alert("프로젝트가 복원되었습니다.");
				if (onSuccess) onSuccess();
				router.refresh();
			} else {
				const errorData = await response.json();
				alert(errorData.message || "복원에 실패했습니다.");
			}
		} catch (error) {
			console.error("복원 중 오류:", error);
			alert("복원 중 오류가 발생했습니다.");
		} finally {
			setIsRestoring(false);
		}
	};

	return { isRestoring, handleProjectRestore };
}