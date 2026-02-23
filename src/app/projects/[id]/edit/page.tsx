
import PageHeader from "@/components/common/page-header";
import ProjectSectionHeader from "@/components/common/project-section-header";

import ProjectForm from "@/components/form/project-form";
import { ProjectDataType } from "@/types/project.data";

import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function ProjectEditPage({ params }: Props) {

	const { id } = await params;

	// 1. 서버에서 직접 최신 JSON 파일 읽기
	const dbPath = path.join(process.cwd(), "data", "testDB00.json");
	const fileContent = await fs.readFile(dbPath, "utf-8");
	const projectData: ProjectDataType[] = JSON.parse(fileContent);

	// 2. ID에 해당하는 프로젝트 찾기
	const curProject = projectData.find((p) => p.id === id);

	// 3. 데이터가 없으면 404 페이지로 보냄
	if (!curProject) {
		return notFound();
	}

	return (
		<>
			{/* 1. 메뉴명 (1depth) */}
			<PageHeader title="프로젝트" />

			<div className="contents">
				<section className="section type2 project-detail" >
					<ProjectSectionHeader id={id} title="수정하기" mode="edit" />

					{/* 실제 입력 폼 */}
					<ProjectForm
						id={id}
						initialData={curProject}
						mode="edit" />

				</section>

			</div>
		</>
	);
}
