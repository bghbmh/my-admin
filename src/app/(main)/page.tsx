export const dynamic = 'force-dynamic';
import { projectService } from '@/services/projectService';
import { notFound } from "next/navigation";
import { ProjectDataType } from "@/types/project.data";

import PageHeader from "@/components/common/page-header";
import DashBoard from "@/components/DashBoard";


import { createClient } from '@/utils/server-supabase';

export default async function Home() {

	let projectList: ProjectDataType[] = [];
	let isError = false;

	const supabase = await createClient(); // 비동기로 쿠키 읽기
	const { data: { user } } = await supabase.auth.getUser(); // 서버에서 유저 확인

	const isAdmin = user?.user_metadata?.role === 'admin';
	const isLogged = !!user;


	try {
		// 데이터 호출 시 서버가 판단한 권한을 넘겨줌
		projectList = await projectService.getAllProjects(isAdmin, isLogged);
	} catch (error) {
		console.error('데이터 로드 실패:', error);
		isError = true;
	}

	return (
		<>
			<PageHeader title="대시보드_test" />
			<DashBoard list={projectList} />

		</>
	);
}

