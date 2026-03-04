"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { projectService } from "@/services/projectService";

import DropDownTypeA from "./dropdown-type-a";
import "./project-section-header.scss";
interface SectionHeaderProps {
	title: string;
	id?: string;
	mode?: string; // "edit" or "view"
}

export default function ProjectSectionHeader({ title, id, mode }: SectionHeaderProps) {

	const router = useRouter();

	const handleDelete = async () => {
		if (!id) {
			alert("삭제할 프로젝트 ID를 찾을 수 없습니다.");
			return;
		}

		if (confirm("정말 삭제하시겠습니까?")) {
			try {
				// 1. 삭제 서비스 호출
				await projectService.deleteProjects([id]);

				// 2. 성공 알림 (이 부분이 확실히 실행됩니다)
				alert("프로젝트가 성공적으로 삭제되었습니다. ✨");

				// 3. 페이지 이동 및 데이터 갱신
				router.push("/projects");
				router.refresh();

			} catch (error: any) {
				let finalMessage = "삭제 중 오류가 발생했습니다.";

				try {
					// JSON 형태의 커스텀 에러인지 확인
					const errorData = JSON.parse(error.message);
					if (errorData.user === "guest") {
						finalMessage = `🚫 [권한 제한] ${errorData.msg}`;
					} else {
						finalMessage = errorData.msg;
					}
				} catch (e) {
					// 일반 텍스트 에러일 경우
					finalMessage = error.message || finalMessage;
				}

				alert(finalMessage); // 🎯 실패 시에도 여기서 얼랏이 뜹니다.
			}
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
			<header className="project-section-header">
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
			<hr className="solid mt-0" />

		</>
	);
}