import "@/styles/base.scss"; // 민희님이 커스텀한 부트스트랩 로드
import "@/styles/reset.scss";
import "@/styles/common.scss";

import { Metadata, Viewport } from "next";

// 1. 뷰포트 및 포맷 감지 설정 (viewport 관련 태그들)
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1.0,
	minimumScale: 1.0,
	maximumScale: 1.0,
	userScalable: true,
};

// 2. 일반 메타데이터 설정
export const metadata: Metadata = {
	title: "박민희 관리자",
	description: "안녕하세요 박민희입니다",
	keywords: ["bghbmh", "bmh", "design", "UX", "UI", "web publisher", "박민희"],
	authors: [{ name: "Bak Min Hui_BMH_박민희" }],
	creator: "박민희",
	publisher: "박민희",
	formatDetection: {
		telephone: false,
		address: false,
		email: false,
	},
	// robots 설정
	robots: {
		index: true,
		follow: true,
	},
	// 오픈 그래프 (OG) 설정
	openGraph: {
		title: "안녕하세요 박민희입니다",
		description: "디자인/퍼블리셔",
		url: "https://bghbmh.github.io/portfolio/",
		siteName: "박민희 관리자",
		images: [
			{
				url: "/img/icon192.jpg", // public 폴더 기준 경로
				width: 192,
				height: 192,
			},
		],
		locale: "ko_KR",
		type: "website",
	},
	// 아이콘 설정 (favicon 등)
	icons: {
		// icon: "/assets/img/favicon.ico",
	},
	// 기타 커스텀 메타태그 (http-equiv 등)
	other: {
		"apple-mobile-web-app-title": "박민희 관리자",
	},
};

import Header from "@/components/common/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body>
				<Header />

				<main className="common">

					{children}
				</main>

			</body>
		</html>
	);
}