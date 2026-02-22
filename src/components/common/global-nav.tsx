"use client"; // 클릭 이벤트와 경로 체크를 위해 필요합니다.

// 메뉴 데이터 타입 정의
interface MenuItem {
	text: string;
	href: string;
	icon: string;
}

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./global-nav.scss"; // 스타일 파일 연결

export default function GlobalNav() {
	const pathname = usePathname();

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
			href: '/profile',
			icon: 'icon-svg-user1',
			text: '내 정보'
		},
		{
			href: '/setting',
			icon: 'icon-svg-gear-settings',
			text: '설정'
		},
		{
			href: '/layout',
			icon: 'icon-svg-gear-settings',
			text: '기본 UI'
		}
	];

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
				<button type="button" className="btn ctrl-logout">
					<span>로그아웃</span>
					<i className="icon-svg2-logout"></i>
				</button>
			</div>
		</aside>
	);
}