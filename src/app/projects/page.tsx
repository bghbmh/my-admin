
//export const dynamic = 'force-dynamic';
//export const revalidate = 0;

import { MAIN_CATEGORY } from "@/constants/config";
import { ProjectDataType } from "@/types/project.data";

import fs from "fs/promises";
import path from "path";

import PageHeader from "@/components/common/page-header";
import ProjectsListItem from "@/components/projects-list-item";
import ProjectsListClient from "./ProjectsListClient";

let testList = 0;

export default async function ProjectsListPage() {

	// 1. 서버에서 직접 최신 JSON 파일 읽기
	const dbPath = path.join(process.cwd(), "data", "testDB00.json");
	const fileContent = await fs.readFile(dbPath, "utf-8");
	const projectList: ProjectDataType[] = JSON.parse(fileContent);

	testList += 1;

	console.log("ProjectsListPage 지우고나서 idx :", testList, ' == ', projectList.length); // 디버깅용 로그

	return (
		<>
			<PageHeader title="프로젝트" />

			{/* 2. 실제 콘텐츠 영역 (RootLayout의 main.common 안에 들어옴) */}
			<div className="contents">
				<ProjectsListClient list={projectList} />
			</div>
		</>
	);
}
