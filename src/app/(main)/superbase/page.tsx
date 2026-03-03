'use client'
import { supabase } from '@/lib/supabase';
import { ProjectDataType } from "@/types/project.data";

import dummyDataRaw from "@/constants/myDB.json";
export const dynamic = 'force-dynamic';

export default async function TempUpload() {

	// JSON 데이터가 배열인지 확인 (구조에 따라 .projectList 등이 필요할 수 있음)
	const dummyData = dummyDataRaw as ProjectDataType[];


	const onUpload = async () => {
		// insert() 안에 배열을 통째로 넣으면 끝납니다.
		const { error } = await supabase
			.from('portfolio')
			.insert(dummyData);

		if (error) {
			console.error('❌ 실패:', error);
			alert('에러 발생! 콘솔을 보세요.');
		} else {
			alert('✅ 데이터 삽입 성공!');
		}
	};

	return (
		<div style={{ padding: 50 }}>
			<h1>데이터 마이그레이션</h1>
			<button onClick={onUpload} style={{ padding: '10px 20px', cursor: 'pointer' }}>
				Supabase로 데이터 쏘기
			</button>
		</div>
	);
}