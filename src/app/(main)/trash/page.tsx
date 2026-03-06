// src/app/trash/page.tsx

export const dynamic = 'force-dynamic';
import { ProjectDataType } from "@/types/project.data";
import { createClient } from '@/utils/server-supabase';
import { projectService } from '@/services/projectService';

import PageHeader from "@/components/common/page-header";
import TrashListClient from "./TrashListClient";

export default async function TrashPage() {
	let projectList: ProjectDataType[] = [];
	let isError = false;

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	//  로그인 여부도 함께 확인
	const isLogged = !!user;

	try {
		// 1. 전체 목록을 가져옵니다. 
		//  isAdmin,
		projectList = await projectService.getTrashProjects(isLogged);
		//projectList = await projectService.getTrashProjects();
	} catch (error) {
		console.error('데이터 로드 실패:', error);
		isError = true;
	}

	// 2. 필터링 및 정렬 로직 수정
	const deleteList = projectList
		.sort((a, b) => {
			// 삭제일(deletedAt) 기준 내림차순 정렬 (최신 삭제 항목이 위로)
			const dateA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
			const dateB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
			return dateB - dateA;
		});

	if (isError) {
		return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
	}

	return (
		<>
			<PageHeader title="휴지통" />
			<div id="main-common-container">
				{/* 3. 필터링된 목록을 전달 */}
				<TrashListClient list={deleteList} />
			</div>
		</>
	);
}