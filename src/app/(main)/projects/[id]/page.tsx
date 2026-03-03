// 실시간 최신 데이터를 불러오기 위한 설정
export const dynamic = 'force-dynamic';
import { projectService } from '@/services/projectService';
import { notFound } from "next/navigation";

import PageHeader from "@/components/common/page-header";
import ProjectSectionHeader from "@/components/common/project-section-header";
import ProjectViewDetail from "@/components/form/project-view-detail";



interface Props {
	params: Promise<{ id: string }>;
}

export default async function ProjectViewPage({ params }: Props) {
	const { id } = await params;

	// 1. Supabase에서 해당 프로젝트 데이터만 조회
	const curProject = await projectService.getProjectById(id);

	// 2. 데이터가 없다면 404
	if (!curProject) {
		return notFound();
	}

	return (
		<>
			<PageHeader title="프로젝트" mode="view" currentTitle={curProject.title} />

			<div id="main-common-container">
				<section className="section type2 project-detail">
					<ProjectSectionHeader id={id} title={curProject.title} mode="view" />

					{/* initialData로 Supabase에서 가져온 데이터 전달 */}
					<ProjectViewDetail id={id} initialData={curProject} mode="view" />
				</section>
			</div>
		</>
	);
}