

import BrandLogo from "./brand-logo";
import GlobalNav from "./global-nav";
import HeaderUserInfo from "../header-user-info";

import fs from "fs/promises";

import { DB_TEMP_PROFILE } from "@/constants/paths";
// 임시 데이터 정의

const MOCK_BRAND_LOGO = {
	"alt": "박민희 로고",
	"name": "test-user0.png",
	"size": 12345678,
	"type": "image/png",
	"lastModified": 1728845897477,
	"webUrl": "/img/common/logo-temp.svg"
};

export default async function Header() {

	const fileContent = await fs.readFile(DB_TEMP_PROFILE, "utf-8");
	const profile: any[] = JSON.parse(fileContent);

	console.log("sdf - ", profile)

	return (
		<header className="common">
			{/* 나중에 로고나 다른 요소가 들어올 자리를 미리 확보할 수 있어요 */}
			<BrandLogo info={MOCK_BRAND_LOGO} />
			<HeaderUserInfo profile={profile[0]} />
			<GlobalNav />

		</header>
	);
}