

import fs from "fs/promises";
import path from "path";

import PageHeader from "@/components/common/page-header";
import ProjectSectionHeader from "@/components/common/project-section-header";

import MyProfileClient from "./MyProfileClient";

import { DB_TEMP_PROFILE } from "@/constants/paths";

export default async function MyProfile() {
	const fileContent = await fs.readFile(DB_TEMP_PROFILE, "utf-8");
	const profile: any[] = JSON.parse(fileContent);

	return (
		<>
			{/* 1. 메뉴명 (1depth) */}
			<PageHeader title="개인정보" mode="view" />

			<div id="main-common-container"  >
				<MyProfileClient info={profile[0]} />
			</div>
		</>
	);
}
