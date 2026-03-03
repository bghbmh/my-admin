
// 실시간 최신 데이터를 불러오기 위한 설정
export const dynamic = 'force-dynamic';
import { createClient } from '@/utils/server-supabase';
import { projectService } from '@/services/projectService';
import { notFound } from "next/navigation";

import { ProjectDataType } from "@/types/project.data";

import PageHeader from "@/components/common/page-header";
import ArchivePageClient from "./ArchivePageClient";

export default async function ArchivePage() {

	// 2. 데이터 가져오기 (에러 핸들링 포함)
	let projectList: ProjectDataType[] = [];
	let isError = false;

	const supabase = await createClient(); // 비동기로 쿠키 읽기
	const { data: { user } } = await supabase.auth.getUser(); // 서버에서 유저 확인

	const isAdmin = user?.user_metadata?.role === 'admin';
	const isLogged = !!user;

	try {
		projectList = await projectService.getAllProjects(isAdmin, isLogged);
	} catch (error) {
		console.error('데이터 로드 실패:', error);
		isError = true;
	}

	return (
		<>
			<PageHeader title="기록저장소" />

			{/* 2. 실제 콘텐츠 영역 (RootLayout의 main.common 안에 들어옴) */}
			<div id="main-common-container"  >
				<ArchivePageClient projects={projectList} />
			</div>
		</>
	);
}
