// src/services/projectService.ts
import { supabase } from '@/lib/supabase'; // 👈 범용 클라이언트(supabase.ts) 사용 권장
import { createClient } from '@/utils/client-supabase'; // 👈 클라이언트용 가져오기
import { ProjectDataType } from '@/types/project.data';


export const projectService = {

	// [추가] 유저 권한을 확인하는 공통 내부 함수
	async checkAdminRole() {
		const supabase = createClient();
		const { data: { user } } = await supabase.auth.getUser();
		const isAdmin = user?.user_metadata?.role === 'admin';
		const isLogged = !!user;

		return { isAdmin, isLogged, user };
	},

	// 1. 모든 프로젝트 조회 (권한 인자 추가)
	async getAllProjects(isAdmin: boolean = false, isLogged: boolean = false) {
		const { data, error } = await supabase
			.from('portfolio')
			.select('*')
			.order('projectNum', { ascending: false });

		if (error) throw error;

		// 🎯 [중요] 한 곳에서 관리하는 데이터 선별 로직
		// 로그인 상태인데 관리자가 아니라면(게스트) 5개로 제한
		if (isLogged && !isAdmin) {
			console.log("🚀 [Service] 게스트 권한 감지: 5개만 반환합니다.");
			return (data?.slice(0, 6) ?? []) as ProjectDataType[];
		}

		// 그 외(관리자 혹은 비로그인 방문자)는 전체 반환
		return (data ?? []) as ProjectDataType[];
	},

	// 2. 단일 프로젝트 상세 조회
	async getProjectById(id: string) {
		const { data, error } = await supabase
			.from('portfolio')
			.select('*')
			.eq('id', id)
			.single();

		if (error) throw error;
		return data as ProjectDataType;
	},

	// 3. 프로젝트 수정
	async updateProject(id: string, updates: Partial<ProjectDataType>) {

		const { isAdmin } = await this.checkAdminRole();
		// 🎯 관리자가 아니면 즉시 차단
		if (!isAdmin) {
			throw new Error(JSON.stringify({
				user: "guest",
				code: "AUTH_REQUIRED",
				msg: "게스트 계정은 수정 권한이 없습니다."
			}));
		}

		const { data, error } = await supabase
			.from('portfolio')
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// 4. 프로젝트 삭제
	// async deleteProject(id: string) {

	// 	const { isAdmin } = await this.checkAdminRole();
	// 	if (!isAdmin) {
	// 		throw new Error(JSON.stringify({
	// 			user: "guest",
	// 			code: "AUTH_REQUIRED",
	// 			msg: "게스트 계정은 삭제 권한이 없습니다."
	// 		}));
	// 	}

	// 	const { error } = await supabase
	// 		.from('portfolio')
	// 		.delete()
	// 		.eq('id', id);

	// 	if (error) throw error;
	// 	return true;
	// },

	// [추가] 여러 개 프로젝트 일괄 삭제
	async deleteProjects(ids: string[]) {
		// 1. 권한 체크 (아까 만든 checkAdminRole 활용)
		const { isAdmin } = await this.checkAdminRole();
		if (!isAdmin) {
			throw new Error(JSON.stringify({
				user: "guest",
				code: "AUTH_REQUIRED",
				msg: "게스트 계정은 삭제 권한이 없습니다."
			}));
		}

		// 2. Supabase 일괄 삭제 실행 (in 연산자 사용)  
		const { error } = await supabase
			.from('portfolio')
			.update({ isDeleted: true, deletedAt: new Date().toISOString() }) // 삭제 표시
			.in('id', ids); // 여러 ID를 한꺼번에 삭제

		if (error) throw error;
		return true;
	},

	async restoreProjects(ids: string[]) {
		const { isAdmin } = await this.checkAdminRole();
		if (!isAdmin) {
			throw new Error(JSON.stringify({
				user: "guest",
				code: "AUTH_REQUIRED",
				msg: "게스트 계정은 복원 권한이 없습니다."
			}));
		}

		const { data, error } = await supabase
			.from('portfolio')
			.update({ isDeleted: false, deletedAt: null }) // 복원
			.in('id', ids);

		if (error) throw error;
		return data;
	},

	// 5. 프로젝트 생성 (isAdmin 인자 추가)
	async createProject(newProject: ProjectDataType) {
		const { isAdmin } = await this.checkAdminRole();
		if (!isAdmin) {
			throw new Error(JSON.stringify({
				user: "guest",
				code: "AUTH_REQUIRED",
				msg: "게스트 계정은 등록 권한이 없습니다."
			}));
		}
		console.log("🚀 [Service] createProject 호출 - ", newProject);

		const { data, error } = await supabase
			.from('portfolio')
			.insert([newProject])
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Auth 관련 함수들은 클라이언트 컴포넌트(로그인 페이지)에서 주로 쓰이므로 유지
	async login(email: string, pass: string) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password: pass,
		});
		if (error) throw error;
		return data;
	},

	async logout() {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	},

	// 현재 세션 확인 (누가 로그인했는지 체크)
	async getUser() {
		const { data: { user } } = await supabase.auth.getUser();
		return user;
	}
};

