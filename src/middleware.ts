// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
	// 1. 초기 응답 객체 생성
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	})

	// 2. 서버 클라이언트 설정
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					// 요청과 응답 모두에 쿠키를 동기화
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options)
					)
				},
			},
		}
	)

	// 3. 세션 확인 (getSession이 미들웨어에서 더 빠르고 안정적입니다)
	const { data: { session } } = await supabase.auth.getSession()

	const isLoginPage = request.nextUrl.pathname.startsWith('/login')

	// [로직 1] 세션 없는데 비밀 페이지 가려고 하면 -> 로그인으로
	if (!session && !isLoginPage) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// [로직 2] 로그인 됐는데 로그인 페이지 가려고 하면 -> 메인으로
	if (session && isLoginPage) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return response
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img).*)'],
}