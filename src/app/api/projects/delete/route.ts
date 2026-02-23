import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';


export async function DELETE(req: Request) {
	const DBpath = path.join(process.cwd(), 'data', 'testDB00.json');
	const trashDBPath = path.join(process.cwd(), 'data', 'trashDB.json');
	const trashRoot = path.join(process.cwd(), 'src', 'trash'); // 휴지통 경로: src/trash

	try {
		const body = await req.json();
		// id가 하나만 왔을 경우 배열로 감싸고, 여러 개(ids)가 왔으면 그대로 사용
		const targetIds = body.ids || (body.id ? [body.id] : []);

		if (targetIds.length === 0) {
			return NextResponse.json({ message: '삭제할 ID가 없습니다.' }, { status: 400 });
		}

		// 현재 DB 읽기 (파일이 없을 경우를 대비해 빈 배열 기본값 설정 권장)
		const curData = await fs.readFile(DBpath, 'utf-8');
		const DB = JSON.parse(curData);

		//  삭제(이동) 대상 프로젝트 찾기
		const initialLength = DB.length;
		const projectsToMove = DB.filter((p: any) => targetIds.includes(p.id));
		const updatedDB = DB.filter((p: any) => !targetIds.includes(p.id));

		// 4. 실제로 삭제된 게 있는지 확인 (선택 사항이지만 디버깅에 좋음)
		if (initialLength === updatedDB.length || initialLength === projectsToMove.length) {
			return NextResponse.json({ message: '삭제할 데이터를 찾을 수 없습니다.' }, { status: 404 });
		}

		// 3. 물리적 폴더 이동 처리
		const timestamp = Date.now();
		for (const project of projectsToMove) {
			// 예: process.cwd() / 'public' / 'projects' / '폴더명'
			const oldPath = path.join(process.cwd(), 'public', 'uploads', project.id);
			const newPath = path.join(trashRoot, `${project.id}_${timestamp}`);

			try {
				// trash 폴더 내에 중복된 이름이 있을 수 있으므로 체크하거나 날짜를 붙이는 것이 안전합니다.
				await fs.rename(oldPath, newPath);
				console.log(`폴더 이동 성공: ${project.id} -> src/trash`);
			} catch (err: any) {
				// 폴더가 없는 경우 등의 에러 처리
				console.error(`폴더 이동 실패 (${project.id}):`, err.message);
			}
		}

		// 휴지통 DB 읽기 (없으면 빈 배열)
		let trashDB: any[] = [];
		try {
			const trashData = await fs.readFile(trashDBPath, 'utf-8');
			trashDB = JSON.parse(trashData);
		} catch {
			trashDB = [];
		}

		const trashEntries = projectsToMove.map((project: any) => ({
			...project,
			deletedAt: timestamp,
			trashFolderName: `${project.id}_${timestamp}` // 실제 폴더명과 일치시키기
		}));
		trashDB.push(...trashEntries);

		// 4. DB 파일 업데이트
		await Promise.all([
			fs.writeFile(DBpath, JSON.stringify(updatedDB, null, 4), 'utf-8'),
			fs.writeFile(trashDBPath, JSON.stringify(trashDB, null, 4), 'utf-8'), // ✅ 추가
		]);

		console.log(`[삭제 완료] ID: ${targetIds.join(', ')}`);

		return NextResponse.json({
			message: `${projectsToMove.length}건이 휴지통으로 이동하였습니다.`,
			deletedCount: targetIds.length
		}, { status: 200 });

	} catch (error) {
		return NextResponse.json({ message: '삭제 실패!', error }, { status: 500 });
	}
}
