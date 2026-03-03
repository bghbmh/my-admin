// src/utils/supabase/client.ts (파일을 새로 만드세요)
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)