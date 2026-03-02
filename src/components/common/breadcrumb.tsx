"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./breadcrumb.scss";

const routeLabels: Record<string, string> = {
	"projects": "프로젝트",
	"create": "새로 등록하기",
	"trash": "휴지통",
	"dashboard": "대시보드",
	"edit": "수정하기"
};

// ID 여부 확인 함수
const isResourceId = (segment: string) => {
	return segment.length > 10 || (/\d/.test(segment) && /[a-z]/.test(segment));
};

interface BreadcrumbProps {
	currentTitle?: string; // 현재 페이지의 실제 제목 (예: 프로젝트명)
}

export default function Breadcrumb({ currentTitle }: BreadcrumbProps) {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter(Boolean);

	return (
		<nav className="breadcrumb-wrap" aria-label="breadcrumb">
			<ol className="breadcrumb-list">
				<li className="breadcrumb-item">
					<Link href="/" className="home-link">
						{/* 홈 아이콘 SVG (기존과 동일) */}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="14"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
						<span>홈</span>
					</Link>
				</li>

				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
					const isLast = index === pathSegments.length - 1;

					let label = routeLabels[segment];

					if (!label) {
						if (isResourceId(segment)) {
							// 마지막 마디가 ID라면 전달받은 제목을 쓰고, 없으면 '상세보기'
							label = currentTitle ? currentTitle : "상세보기";
						} else {
							label = segment;
						}
					}

					return (
						<li key={href} className={`breadcrumb-item ${isLast ? "current" : ""}`}>
							{isLast ? (
								<span className="text">{label}</span>
							) : (
								<Link href={href}><span className="text">{label}</span></Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}