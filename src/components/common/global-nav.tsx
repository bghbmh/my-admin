"use client"; // 클릭 이벤트와 경로 체크를 위해 필요합니다.
import { createClient } from '@/utils/client-supabase'; // 클라이언트용 가져오기
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // useRouter 추가
// 메뉴 데이터 타입 정의
interface MenuItem {
	text: string;
	href: string;
	icon: string;
}

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./global-nav.scss"; // 스타일 파일 연결

// 기존에 넘겨주던 list 데이터를 배열로 정의
const globalNavList = [
	{
		href: '/',
		icon: 'icon-svg-home1',
		text: '대시보드'
	},
	{
		href: '/projects',
		icon: 'icon-svg2-spark',
		text: '프로젝트'
	},
	{
		href: '/todo',
		icon: 'icon-svg2-calendar2',
		text: '할 일'
	},
	{
		href: '/archive',
		icon: 'icon-svg-gear-settings',
		text: '기록저장소'
	},
	{
		href: '/myprofile',
		icon: 'icon-svg-user1',
		text: '내 정보'
	},
	{
		href: '/setting',
		icon: 'icon-svg-gear-settings',
		text: '설정'
	}
];

export default function GlobalNav({ isLogged, isAdmin }: { isLogged: boolean; isAdmin: boolean }) {
	const pathname = usePathname();

	const router = useRouter();
	const supabase = createClient(); // 클라이언트 클라이언트 생성

	const handleLogout = async () => {
		try {
			// 1. 여기서 직접 로그아웃을 호출합니다. (쿠키 삭제를 위해)
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			// 2. 서버 컴포넌트들에게 세션이 바뀌었음을 알립니다.
			router.refresh();

			// 3. 페이지를 완전히 새로고침하며 이동 
			window.location.replace("/login");

		} catch (error: any) {
			alert("로그아웃 실패: " + error.message);
		}
	};

	return (
		<aside className="global-nav-wrapper">
			<nav className="gnb">
				{globalNavList.map((m, i) => (
					<div key={i} className="gnb-item">
						{/* Next.js의 Link는 a 태그처럼 작동하며 새로고침 없이 이동합니다 */}
						<Link
							href={m.href}
							className={`btn ${pathname === m.href ? "active" : ""}`}
						>
							<i className={m.icon} aria-hidden="true"></i>
							<span>{m.text}</span>
						</Link>
					</div>
				))}
			</nav>

			<div className="btn-wrap">
				{isLogged ? (
					<button type="button" className="btn ctrl-logout" onClick={handleLogout}>
						<span>로그아웃</span>
						<i className="icon-svg2-logout"></i>
					</button>
				) : (
					<Link href="/login" className="btn ctrl-login">
						<span>로그인</span>
					</Link>
				)}
			</div>
		</aside>
	);
}