"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // URL 관련 훅 추가
import { MAIN_CATEGORY } from "@/constants/config";
import { ProjectDataType } from "@/types/project.data";

import { useProjectDelete } from "@/hooks/useProjectDelete";
import { projectService } from "@/services/projectService";
import { usePagination } from "@/hooks/usePagination";

import ProjectsListItem from "@/components/projects-list-item";
import SectionHeader from "@/components/common/section-header";
import Pagination from "@/components/common/Pagination";
import { ICONSET } from '@/types/icon.data';
import '@/styles/bPagination.css'

interface Props {
	list: ProjectDataType[];
}

export default function ProjectsListClient({ list }: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [isDeleting, setIsDeleting] = useState(false);

	// 1. URL에서 category 파라미터 읽기 (없으면 0)
	const categoryParam = Number(searchParams.get("category")) || 0;
	const pageParam = Number(searchParams.get("page")) || 1;

	// 현재 활성화된 탭 정보 계산
	const activeTab = useMemo(() => {
		const found = MAIN_CATEGORY.find(c => c.type === categoryParam);
		return found ? { number: found.type, name: found.name } : { number: 0, name: "전체" };
	}, [categoryParam]);

	const [selectedProjects, setSelectedProjects] = React.useState<string[]>([]);

	// 2. 필터링 로직 (URL 파라미터 기준)
	const filteredProjects = useMemo(() => {
		const filtered = categoryParam === 0
			? list
			: list.filter(p => {
				const mainCat = p.category.find(cat => cat.label === "main");
				return Number(mainCat?.type) === categoryParam;
			});

		return [...filtered].sort((a, b) => b.registerDate - a.registerDate);
	}, [list, categoryParam]);


	const {
		currentPage,
		setCurrentPage,
		totalPages,
		paginatedList,
		pageNumbers
	} = usePagination(filteredProjects, 10, 3, pageParam);

	// [추가] URL의 페이지 번호가 바뀌면 페이지네이션 훅의 상태를 동기화합니다.
	useEffect(() => {
		setCurrentPage(pageParam);
	}, [pageParam, setCurrentPage]);

	const handleSelectedProjects = (checked: boolean, id: string) => {
		setSelectedProjects(prev => (
			checked ? [...prev, id] : prev.filter(prevId => prevId !== id)
		));
	};

	//const { handleProjectDelete, isDeleting } = useProjectDelete();

	const handleDelete = async () => {
		if (confirm("정말 삭제하시겠습니까?")) {

			setIsDeleting(true);

			try {
				// 1. 삭제 서비스 호출
				await projectService.deleteProjects(selectedProjects);

				alert("프로젝트가 성공적으로 삭제되었습니다. ✨");
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
				} catch (e) {// 일반 텍스트 에러일 경우
					finalMessage = error.message || finalMessage;
				}

				alert(finalMessage); // 🎯 실패 시에도 여기서 얼랏이 뜹니다.
			} finally {
				setIsDeleting(false);
			}
		}
	};

	// 3. 탭 클릭 시 URL 변경 함수
	const changeTab = (type: number) => {
		const params = new URLSearchParams(searchParams.toString());
		if (type === 0) {
			params.delete("category");
		} else {
			params.set("category", type.toString());
		}
		params.set("page", "1"); // 카테고리 바꿀 때 페이지 초기화
		router.push(`${pathname}?${params.toString()}`);
		setSelectedProjects([]);
	};

	// 4. 페이지 변경 시 URL을 바꾸는 함수
	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());

		// URL을 변경하면 새로고침해도 이 값이 유지됩니다.
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<>
			<nav className="projects-nav" aria-label="프로젝트 카테고리">
				<div className="nav-list" role="tablist">
					<button
						type="button"
						className={`btn nav-item ${categoryParam === 0 ? "active" : ""}`}
						onClick={() => changeTab(0)}>
						<i className="icon-svg2-all" aria-hidden="true"></i>전체
					</button>
					{MAIN_CATEGORY.map(category => (
						<button key={category.type}
							type="button"
							className={`btn nav-item ${categoryParam === category.type ? "active" : ""}`}
							onClick={() => changeTab(category.type)}>
							<i className={category.icon} aria-hidden="true"></i>{category.name}
						</button>
					))}
				</div>
			</nav>

			<SectionHeader
				title={
					<>
						<i className="icon-svg2-me" aria-hidden="true"></i>
						<h3 className="text">'{activeTab.name}' 보기
							<small className="font-number">{filteredProjects.length}</small>
						</h3>
						{selectedProjects.length > 0 &&
							<small className="selected-count">
								<b className="fcPrimary font-monospace">{selectedProjects.length}</b>개 선택됨
							</small>
						}
					</>
				}
				actions={selectedProjects.length > 0 && (
					<div className="btn-wrap">
						<button type="button" onClick={() => setSelectedProjects([])} className="btn cancel">취소</button>
						<button
							type="button"
							className="btn delete"
							onClick={handleDelete}>
							{isDeleting ? "삭제 중..." : "삭제"}
						</button>
					</div>
				)}
			/>

			<section className="projects-list">
				{filteredProjects.length > 0 ? (
					<>
						{paginatedList.map(project => (
							<ProjectsListItem
								key={project.id}
								projectData={project}
								isSelected={selectedProjects.includes(project.id)}
								onSelected={(checked) => handleSelectedProjects(checked, project.id)}
							/>
						))}
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							// onPageChange={setCurrentPage}
							onPageChange={handlePageChange}
							pageNumbers={pageNumbers}
						/>
					</>
				) : (
					<div className="none list-items">
						<ICONSET type="question" />
						<div>해당 카테고리에 등록된 프로젝트가 없습니다</div>
						<a className="btn create-project primary" href="/projects/create">
							<i className="icon-svg2-folder-plus" aria-hidden="true"></i>
							<span>새 프로젝트 추가</span>
						</a>
					</div>
				)}
			</section>
		</>
	);
}