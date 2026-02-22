"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "./section-header.scss";

import DropDownTypeA from "./dropdown-type-a";

interface SectionHeaderProps {
	title: string;
	id?: string;
	mode?: string; // "edit" or "view"
}

export default function ProjectSectionHeader({ title, id, mode }: SectionHeaderProps) {

	const router = useRouter();

	const handleDelete = () => {
		if (confirm("정말 삭제하시겠습니까?")) {

			// 1. 서버에 삭제 요청 보내기 (예시 URL, 실제 API 엔드포인트로 변경 필요)
			fetch(`/api/projects/delete`, {
				method: "DELETE",
				body: JSON.stringify({ id }),
			}).then((response) => {
				if (response.ok) {
					alert("프로젝트가 삭제되었습니다.");
					router.push("/projects"); // 삭제 후 목록 페이지로 이동
				} else {
					alert("삭제에 실패했습니다. 다시 시도해주세요.");
				}
			}).catch((error) => {
				console.error("삭제 중 오류 발생:", error);
				alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
			});
		}
	};

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (confirm("프로젝트 등록을 취소하시겠습니까?")) {
			//router.back(); Next.js 13에서는 useRouter의 back() 메서드가 제거되었으므로, 대신 window.history.back()을 사용합니다.
			// window.history.back();
			//router.push("/projects"); //목록으로 이동하는 방식도 고려할 수 있습니다.

			router.back();
			console.log("취소"); //디버깅용 로그
		}
	};


	return (
		<>
			<header className="section-header">
				<div className="title">
					<h3 className="text">
						{title || "제목없음"}
					</h3>
				</div>
				<div className="btn-wrap">
					<DropDownTypeA>
						{mode === "view" || mode === "edit" ?
							(<button type="button" onClick={handleDelete} className="btn delete desktop-elem">삭제</button>) : ''
						}
						<hr className="solid m-0" />
						{mode !== "view" &&
							<button type="button" onClick={handleCancel} className="btn cancel">취소</button>
						}
						<hr className="solid m-0" />
						{mode === "edit" || mode === "create" ? (
							<button
								type="submit"
								form="project-main-form" // ProjectForm의 id와 반드시 일치
								className="btn primary"
							>
								저장
							</button>
						) : (
							<Link href={`/projects/${id}/edit`} className="btn dark" >수정</Link>
						)}
					</DropDownTypeA>
				</div>
			</header >
			<hr className="solid" />

		</>
	);
}