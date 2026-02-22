"use client"; // 클라이언트 컴포넌트임을 명시

import BrandLogo from "./brand-logo";
import GlobalNav from "./global-nav";
import HeaderUserInfo from "../header-user-info";


// 임시 데이터 정의
const MOCK_USER_DATA = [
	{
		"id": 1728845897477,
		"pw": "asdf1234",
		"nickname": {
			"check": true,
			"value": "miniBig"
		},
		"name": "박민희",
		"image": {
			"main": {
				"name": "test-user0.png",
				"size": 12345678,
				"type": "image/png",
				"lastModified": 1728845897477,
				"webUrl": "/img/profile/test-user0.png" // public 폴더 기준 경로로 수정 권장
			},
			"info": {
				"name": "test-user.png",
				"size": 12345678,
				"type": "image/png",
				"lastModified": 1728845897477,
				"webUrl": "/img/profile/test-user.png"
			}
		},
		"email": "bghbmh@miniBig.com",
		"business": {
			"company": "어떤회사",
			"team": "아무개팀",
			"number": "010-3469-1323",
			"position": "직원"
		},
		"theme": "light"
	}
];

const MOCK_BRAND_LOGO = {
	"alt": "박민희 로고",
	"name": "test-user0.png",
	"size": 12345678,
	"type": "image/png",
	"lastModified": 1728845897477,
	"webUrl": "/img/common/logo-temp.svg"
};

export default function Header() {
	return (
		<header className="common">
			{/* 나중에 로고나 다른 요소가 들어올 자리를 미리 확보할 수 있어요 */}
			<BrandLogo info={MOCK_BRAND_LOGO} />
			<HeaderUserInfo profile={MOCK_USER_DATA[0]} />
			<GlobalNav />

		</header>
	);
}