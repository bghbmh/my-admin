import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { register } from 'module';

import { DB_PATH, UPLOAD_DIR } from '@/constants/paths';


//create
export async function POST(req: Request) {
	try {
		const clientData = await req.json(); // 클라이언트에서 보낸 제목 등 받기 
		const curData = await fs.readFile(DB_PATH, 'utf-8');
		const projects = JSON.parse(curData);

		const timestamp = Date.now();

		// 새 프로젝트 정보 구성
		const newId = 'bmh' + Date.now();
		const uploadNew = {
			...clientData,
			id: newId,
			projectNum: timestamp,
			registerDate: timestamp,
			modifyDate: []
		};

		// 폴더 생성 미리 해두기
		const baseDir = path.join(UPLOAD_DIR, uploadNew.id);

		await fs.mkdir(baseDir, { recursive: true });
		await fs.mkdir(path.join(baseDir, "files"), { recursive: true });
		await fs.mkdir(path.join(baseDir, "images"), { recursive: true });

		// ★ 중요: 기존 배열에 추가한 후 전체 다시 저장
		projects.push(uploadNew);

		await fs.writeFile(DB_PATH, JSON.stringify(projects, null, 4), 'utf-8');



		console.log('uploadNew:', DB_PATH, uploadNew);
		console.log('000 ================================');


		return NextResponse.json({ message: '신규 프로젝트 폴더 생성 성공!', data: uploadNew }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: '저장 실패!', error }, { status: 500 });
	}
}