
export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/server-supabase';
import { projectService } from '@/services/projectService';

import { ProjectDataType } from "@/types/project.data";
import PageHeader from "@/components/common/page-header";
import ProjectsListClient from "./ProjectsListClient";

export default async function ProjectsListPage() {
	// 2. 데이터 가져오기 (에러 핸들링 포함)
	let projectList: ProjectDataType[] = [];
	let isError = false;

	const supabase = await createClient(); // 비동기로 쿠키 읽기
	const { data: { user } } = await supabase.auth.getUser(); // 서버에서 유저 확인

	const isAdmin = user?.app_metadata?.role === 'admin';
	const isLogged = !!user;

	try {
		projectList = await projectService.getAllProjects(isAdmin, isLogged);
	} catch (error) {
		console.error('데이터 로드 실패:', error);
		isError = true;
	}

	const list = projectList
		.filter(p => !p.isDeleted)
		.sort((a, b) => b.registerDate - a.registerDate);

	return (
		<>
			{/* 3. 공통 레이아웃 유지 */}
			<PageHeader title="프로젝트" />

			<div id="main-common-container">
				{isError ? (
					<div className="error-message">
						데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
					</div>
				) : projectList.length === 0 ? (
					<div className="empty-message">등록된 프로젝트가 없습니다.</div>
				) : (
					<ProjectsListClient list={list} />
				)}
			</div>
		</>
	);
}