import { projectService } from '@/services/projectService';
import "@/styles/base.scss";
import "@/styles/reset.scss";
import "@/styles/common.scss";

import Header from "@/components/common/header";
import { createClient } from '@/utils/server-supabase';

// 1. 함수 앞에 async를 붙여야 await를 쓸 수 있습니다.
export default async function RootLayout({ children }: { children: React.ReactNode }) {

	// 2. 서버 클라이언트 생성 및 유저 확인
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	const isAdmin = user?.app_metadata?.role === 'admin';
	const isLogged = !!user;

	console.log("RootLayout - ", user)

	return (
		<html lang="ko">
			<body>
				{/* 3. Header 컴포넌트에 필요한 정보를 props로 전달합니다. */}
				<Header user={user} isAdmin={isAdmin} isLogged={isLogged} />

				<main className="common">
					{children}
				</main>
			</body>
		</html>
	);
}