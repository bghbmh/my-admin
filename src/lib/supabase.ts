// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { ProjectDataType } from '@/types/project.data'; // 타입 파일 경로에 맞춰 수정하세요

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 타입을 지정해서 클라이언트를 생성하면 자동완성이 지원됩니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);