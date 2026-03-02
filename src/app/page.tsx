import fs from "fs/promises";
import path from "path";
import { DB_PATH } from "@/constants/paths";
import { ProjectDataType } from "@/types/project.data";

import PageHeader from "@/components/common/page-header";
import Link from "next/link";

import DashBoard from "@/components/DashBoard";



export default async function Home() {

	// 1. 서버에서 직접 최신 JSON 파일 읽기 
	const fileContent = await fs.readFile(DB_PATH, "utf-8");
	const projectList: ProjectDataType[] = JSON.parse(fileContent);


	return (
		<>
			<PageHeader title="대시보드_test" />
			<DashBoard list={projectList} />

		</>
	);
}

