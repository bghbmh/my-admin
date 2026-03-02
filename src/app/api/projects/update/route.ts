import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { DB_PATH, UPLOAD_DIR, TRASH_DB_PATH, TRASH_FILES_DIR } from '@/constants/paths';
/*
update, 파일 업로드할 때 신규일 경우, 
아이디를 생성 할 때 create 라우터를 이용한 뒤
파일 업로드를 위해서 update 라우터를 이용함
그래서 수정시간이 newModifyDate, 2번 저장돼서
*/
export async function POST(req: Request) {

	const updateP = await req.json();
	const curData = await fs.readFile(DB_PATH, 'utf-8');

	try {
		console.log('updateP:', DB_PATH, updateP);

		const DB = JSON.parse(curData);
		const timestamp = Date.now(); // 수정 시점 생성

		const updatedDB = DB.map((p: any) => {
			if (p.id === updateP.id) {
				// 기존 modifyDate 배열이 있으면 새 시간을 추가하고, 없으면 새로 만듭니다.
				const newModifyDate = p.modifyDate
					? [...p.modifyDate, timestamp]
					: [timestamp];

				return { ...p, ...updateP, modifyDate: newModifyDate };
			}
			return p;
		});
		console.log('111 ================================');
		console.log('updatedDB:', updatedDB);

		await fs.writeFile(DB_PATH, JSON.stringify(updatedDB, null, 4), 'utf-8');

		return NextResponse.json({ message: '저장 성공!', data: updateP }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: '저장 실패!', error }, { status: 500 });
	}
}