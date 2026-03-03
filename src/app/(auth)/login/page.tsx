"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/client-supabase'; // 클라이언트용 가져오기
import "./login.scss"; // 아래 SCSS 참고

export default function LoginPage() {
	const [email, setEmail] = useState("guest@minibig.com");
	const [password, setPassword] = useState("guest");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// 👈 쿠키 관리 기능이 포함된 클라이언트 생성
	const supabase = createClient();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			// 👈 projectService.login 대신 직접 호출 (쿠키 생성 보장)
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			const userRole = data.user?.user_metadata?.role

			// 1. 역할에 따른 인사
			if (userRole === "admin") {
				alert("관리자님, 환영합니다! 🚀")
			} else {
				alert("게스트 계정으로 로그인되었습니다. 😊")
			}

			// 2. 중요: 세션(쿠키) 정보를 서버 컴포넌트가 인식하도록 새로고침 후 이동
			// window.location.href를 사용하면 쿠키가 포함된 상태로 서버에 다시 요청을 보냅니다.
			window.location.replace("/");
		} catch (error: any) {
			alert("로그인 실패: " + (error.message || "계정을 확인해주세요."))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="login-container">
			<div className="login-card">
				<div className="login-header">
					<h1>Admin Login</h1>
					<p>내 포트폴리오 관리를 위해 로그인하세요.</p>
				</div>

				<form onSubmit={handleLogin} className="login-form">
					<label>
						<span className="guide required">이메일</span>
						<input
							type="email"
							placeholder="admin@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							readOnly
							required
						/>
					</label>

					<label>
						<span className="guide required">비밀번호</span>
						<input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							readOnly
							required
						/>
					</label>

					<button type="submit" disabled={loading} className="btn primary ">
						{loading ? "로그인 중..." : "로그인"}
					</button>
				</form>
			</div>
		</div>
	);
}