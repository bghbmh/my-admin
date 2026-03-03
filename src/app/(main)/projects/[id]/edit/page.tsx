// 실시간 최신 데이터를 불러오기 위한 설정
export const dynamic = 'force-dynamic';
import { projectService } from '@/services/projectService';
import { notFound } from "next/navigation";

import PageHeader from "@/components/common/page-header";
import ProjectSectionHeader from "@/components/common/project-section-header";

import ProjectForm from "@/components/form/project-form";
import { ProjectDataType } from "@/types/project.data";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function ProjectEditPage({ params }: Props) {
	const { id } = await params;

	// 1. Supabase에서 수정할 프로젝트 데이터 가져오기
	// (상세 페이지와 동일한 로직을 재사용합니다)
	const curProject = await projectService.getProjectById(id);

	// 2. 데이터가 없으면 404
	if (!curProject) {
		return notFound();
	}

	return (
		<>
			<PageHeader title="프로젝트" currentTitle={curProject.title} />

			<div id="main-common-container">
				<section className="section type2 project-detail">
					{/* 타이틀을 "수정하기"로 명시하여 사용자가 모드를 인지하게 함 */}
					<ProjectSectionHeader id={id} title="수정하기" mode="edit" />

					{/* 실제 입력 폼: Supabase에서 가져온 데이터를 주입 */}
					<ProjectForm
						id={id}
						initialData={curProject}
						mode="edit"
					/>
				</section>
			</div>
		</>
	);
}