"use client";

import React from "react";
import { projectService } from '@/services/projectService';
import { useRouter } from "next/navigation"; // Next.js 라우터 사용

export default function LogoutConfirm() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await projectService.logout();
			alert("로그아웃 되었습니다. 로그인 페이지로 이동합니다.");
			window.location.href = "/login"; // 로그인 페이지로 이동
		} catch (error: any) {
			alert("로그아웃 실패: " + (error.message || "다시 시도해주세요."));
		}

	};

	return (
		<div className="tab-fade-in logout-section">
			<div className="logout-card">
				<div className="icon-box">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e45a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
						<polyline points="16 17 21 12 16 7"></polyline>
						<line x1="21" y1="12" x2="9" y2="12"></line>
					</svg>
				</div>

				<header className="content-header center">
					<h2>로그아웃 하시겠습니까?</h2>
					<p>로그아웃 하시면 현재 세션이 종료되며,<br />다시 이용하시려면 로그인이 필요합니다.</p>
				</header>

				<div className="logout-actions">
					<button type="button" className="cancel-btn" onClick={() => window.history.back()}>
						돌아가기
					</button>
					<button type="button" className="logout-btn" onClick={handleLogout}>
						로그아웃 수행
					</button>
				</div>
			</div>
		</div>
	);
}