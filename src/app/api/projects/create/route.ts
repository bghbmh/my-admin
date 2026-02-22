import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { register } from 'module';

export async function POST(req: Request) {
	try {
		const clientData = await req.json(); // 클라이언트에서 보낸 제목 등 받기
		const DBpath = path.join(process.cwd(), 'data', 'testDB00.json');
		console.log('================================');
		const curData = await fs.readFile(DBpath, 'utf-8');
		const projects = JSON.parse(curData);

		// 새 프로젝트 정보 구성
		const newId = 'bmh' + Date.now();
		const uploadNew = {
			...clientData,
			id: newId,
			projectNum: Date.now(),
			registerDate: Date.now(),
			modifyDate: [Date.now()]
		};

		// 폴더 생성 미리 해두기
		const baseDir = path.join(process.cwd(), "public", "uploads", uploadNew.id);

		await fs.mkdir(baseDir, { recursive: true });
		await fs.mkdir(path.join(baseDir, "files"), { recursive: true });
		await fs.mkdir(path.join(baseDir, "images"), { recursive: true });

		// ★ 중요: 기존 배열에 추가한 후 전체 다시 저장
		projects.push(uploadNew);

		await fs.writeFile(DBpath, JSON.stringify(projects, null, 4), 'utf-8');



		console.log('uploadNew:', DBpath, uploadNew);
		console.log('000 ================================');


		return NextResponse.json({ message: '신규 프로젝트 폴더 생성 성공!', data: uploadNew }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: '저장 실패!', error }, { status: 500 });
	}
}