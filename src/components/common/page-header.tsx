
import React from "react";
import Link from "next/link";
import "./page-header.scss";
import Breadcrumb from "./breadcrumb";

interface PageHeaderProps {
	title: string;
	mode?: "view" | "loading" | "empty";
	onAction?: (action: string) => void;
}

export default function PageHeader({ title, mode = "view", onAction }: PageHeaderProps) {

	// 1. 로딩 상태 렌더링
	if (mode === "loading") {
		return <div className="page-header common loading"><div className="guide">페이지 제목을 찾고 있습니다</div></div>;
	}

	// 2. 데이터 없음 상태 렌더링
	if (mode === "empty") {
		return <div className="page-header common empty no-title"><div className="guide">페이지 제목을 불러오지 못했습니다</div></div>;
	}

	return (
		<header className="page-header-wrapper">
			{/* 메인 헤더 영역 */}
			<div className="page-header">
				<h2 className="page-title">{title}</h2>

				<div className="button-wrap d-flex gap-2">
					{/* 휴지통_임시 버튼 */}
					<Link href="/trash"
						className="btn default"
					>
						<span>휴지통</span>
					</Link>

					<Link href="/projects/create"
						className="btn create-project"
					>
						<i className="icon-svg2-folder-plus" aria-hidden="true"></i>
						<span>새 프로젝트 추가</span>
					</Link>
				</div>
			</div>

			<Breadcrumb />
		</header>
	);
}