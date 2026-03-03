"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // URL 관련 훅 추가
import { ProjectDataType } from "@/types/project.data";
import "./archive.scss";

export default function ArchivePageClient({ projects }: { projects: ProjectDataType[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// 1. URL에서 category 파라미터 읽기 (없으면 0)
	const stateParam: string = searchParams.get("state") || '';

	useEffect(() => {
		setFilter(stateParam || "all");
	}, [stateParam]);

	//console.log("arc - ", stateParam)

	// 1. 최근 등록일 순으로 정렬 (registerDate 기준 내림차순)
	const sortedProjects = useMemo(() => {
		return [...projects].sort((a, b) => b.registerDate - a.registerDate);
	}, [projects]);

	const [selectedId, setSelectedId] = useState<string>(sortedProjects[0]?.id || "");
	const [filter, setFilter] = useState<string>("all");

	// 선택된 프로젝트 데이터 찾기
	const selectedProject = sortedProjects.find(p => p.id === selectedId);

	// 필터링된 리스트
	const filteredList = sortedProjects.filter(p =>
		filter === "all" ? true : p.currentState === filter
	);

	useEffect(() => {
		if (filteredList.length > 0) {
			// 현재 선택된 항목이 필터링된 리스트에 없으면 첫 번째 항목 선택
			if (!filteredList.find(p => p.id === selectedId)) {
				setSelectedId(filteredList[0].id);
			}
		} else {
			setSelectedId(""); // 리스트가 없으면 선택 해제
		}
	}, [filter, filteredList]);

	const getStatusLabel = (state: string) => {
		const map: { [key: string]: string } = {
			complete: "완료", ongoing: "진행중", before: "대기", unknown: "미정"
		};
		return map[state] || "알 수 없음";
	};

	const filterTabs = [
		{ id: "all", label: "전체" },
		{ id: "complete", label: "완료" },
		{ id: "ongoing", label: "진행중" },
		{ id: "before", label: "대기" },
	];

	const handleFilterChange = (id: string) => {
		setFilter(id);
		// URL 파라미터 업데이트 (페이지 새로고침 없이)
		const params = new URLSearchParams(searchParams);
		if (id === 'all') {
			params.delete('state');
		} else {
			params.set('state', id);
		}
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="archive-split-container tab-fade-in">
			{/* 왼쪽: 상세 정보 컬럼 */}
			<main className="detail-column">
				{selectedProject ? (
					<div className="project-detail-view">
						<header className="detail-header">
							<div className="meta">
								<span className={`status-dot ${selectedProject.currentState}`}></span>
								{selectedProject.category.find(c => c.label === "main")?.name}
							</div>
							<h1>{selectedProject.title}</h1>
							<div className="period">
								{selectedProject.startDate} ~ {selectedProject.endDate}
							</div>
						</header>

						<div className="detail-body">
							{selectedProject.titleImage?.[0] && (
								<div className="main-preview">
									<img src={selectedProject.titleImage[0].url} alt="preview" />
								</div>
							)}
							<section className="info-section">
								<h3>Overview</h3>
								<p>{selectedProject.overview.synopsis || "등록된 개요가 없습니다."}</p>
							</section>
							<section className="info-section">
								<h3>Tech Stack</h3>
								<div className="tool-chips">
									{selectedProject.tools.map(tool => <span key={tool} className="chip">{tool}</span>)}
								</div>
							</section>
							<div className="action-area">
								<button className="go-page-btn" onClick={() => window.open(`/projects/${selectedProject.id}`)}>
									전체 페이지로 보기
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="empty-state">프로젝트를 선택해주세요.</div>
				)}
			</main>

			{/* 오른쪽: 아카이브 목록 사이드바 */}
			<aside className="list-sidebar">
				<div className="sidebar-header">
					<h2>Archive List</h2>
					<nav className="filter-tabs">
						<ul>
							{filterTabs.map((tab) => (
								<li
									key={tab.id}
									className={filter === tab.id ? "active" : ""}
									onClick={() => handleFilterChange(tab.id)}
								>
									{tab.label}
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="sidebar-scroll">
					{filteredList.map((p) => (
						<div
							key={p.id}
							className={`list-item ${selectedId === p.id ? 'active' : ''}`}
							onClick={() => setSelectedId(p.id)}
						>
							<div className="item-thumb">
								{p.titleImage?.[0] ? <img src={p.titleImage[0].url} alt="" /> : <div className="no-img" />}
							</div>
							<div className="item-info">
								<span className="cat">{p.category.find(c => c.label === "main")?.name}</span>
								<h4>{p.title}</h4>
								<span className={`state-tag ${p.currentState}`}>{getStatusLabel(p.currentState)}</span>
							</div>
						</div>
					))}
					{filteredList.length === 0 && <div className="no-data">해당 프로젝트가 없습니다.</div>}
				</div>
			</aside>
		</div>
	);
}