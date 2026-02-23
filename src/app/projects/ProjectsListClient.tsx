
"use client";

import React, { useState, useMemo } from "react";
import { MAIN_CATEGORY } from "@/constants/config";
import { ProjectDataType } from "@/types/project.data";
import { useProjectDelete } from "@/hooks/useProjectDelete";

import ProjectsListItem from "@/components/projects-list-item";
import SectionHeader from "@/components/common/section-header";

interface Props {
	list: ProjectDataType[];
}

export default function ProjectsListClient({ list }: Props) {

	const [activeTab, setActiveTab] = useState({ number: 0, name: "전체" });
	const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

	const filteredProjects = useMemo(() => {
		return activeTab.number === 0
			? list
			: list.filter(project =>
				project.category.find(cat => Number(cat.type) === activeTab.number)
			);
	}, [activeTab, list]);

	const handleSelectedProjects = (checked: boolean, id: string) => {
		setSelectedProjects(prev => (
			checked ? [...prev, id] : prev.filter(prevId => prevId !== id)
		))
	}

	console.log("Selected Projects:", selectedProjects);

	const { handleProjectDelete, isDeleting } = useProjectDelete();

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSelectedProjects([]);
		console.log("취소"); //디버깅용 로그 
	};

	console.log("ProjectsListClient 지우고나서 뜨는제:", list);

	return (
		<>
			{/* 2. 실제 콘텐츠 영역 (RootLayout의 main.common 안에 들어옴) */}

			<nav className="projects-nav" aria-label="프로젝트 카테고리">
				<div className="nav-list" role="tablist">
					<button
						type="button"
						className={`btn nav-item ${activeTab.number === 0 ? "active" : ""}`}
						role="tab"
						onClick={() => setActiveTab({ number: 0, name: "전체" })} >
						<i className="icon-svg2-all" aria-hidden="true"></i>전체
					</button>
					{
						MAIN_CATEGORY.map(category => (
							<button key={category.type}
								type="button"
								className={`btn nav-item ${activeTab.number === category.type ? "active" : ""}`}
								role="tab"
								onClick={() => setActiveTab({ number: category.type, name: category.name })}>
								<i className={category.icon} aria-hidden="true"></i>{category.name}
							</button>
						))
					}
				</div>
			</nav>

			<SectionHeader
				title={
					<>
						<i className="icon-svg2-me" aria-hidden="true"></i>
						<h3 className="text">'{activeTab.name}' 보기</h3>
						{selectedProjects.length > 0 && <small className="selected-count"> <b className="fcPrimary font-monospace">{selectedProjects.length}</b>개 선택됨</small>}

					</>
				}
				actions={selectedProjects.length > 0 && (
					<div className="btn-wrap">
						<button type="button" onClick={handleCancel} className="btn cancel">취소</button>
						<button
							type="button"
							className="btn delete "
							onClick={() => handleProjectDelete(selectedProjects, () => setSelectedProjects([]))}>
							{isDeleting ? "삭제 중..." : "삭제"}
						</button>
					</div>
				)}
			/>

			<section className="  projects-list" >
				{filteredProjects.map(project => (
					<ProjectsListItem
						key={project.id}
						projectData={project}
						isSelected={selectedProjects.includes(project.id)}
						onSelected={(checked) => handleSelectedProjects(checked, project.id)} />
				))}
			</section>
		</>
	);
}
