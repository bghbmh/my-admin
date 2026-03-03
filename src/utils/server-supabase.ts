import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				// 기존 get, set 대신 최신 getAll, setAll 방식을 사용합니다.
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						)
					} catch {
						// 서버 컴포넌트 내부에서는 무시해도 됩니다.
					}
				},
			},
		}
	)
}