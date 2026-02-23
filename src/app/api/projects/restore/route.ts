import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
	const DBpath = path.join(process.cwd(), 'data', 'testDB00.json');
	const trashDBPath = path.join(process.cwd(), 'data', 'trashDB.json');
	const trashRoot = path.join(process.cwd(), 'src', 'trash');
	const uploadsRoot = path.join(process.cwd(), 'public', 'uploads');

	try {
		const body = await req.json();
		const targetIds: string[] = body.ids || (body.id ? [body.id] : []);

		if (targetIds.length === 0) {
			return NextResponse.json({ message: '복원할 ID가 없습니다.' }, { status: 400 });
		}

		// 1. trashDB에서 복원 대상 찾기
		const trashData = await fs.readFile(trashDBPath, 'utf-8');
		const trashDB: any[] = JSON.parse(trashData);

		const projectsToRestore = trashDB.filter(p => targetIds.includes(p.id));
		const updatedTrashDB = trashDB.filter(p => !targetIds.includes(p.id));

		if (projectsToRestore.length === 0) {
			return NextResponse.json({ message: '복원할 데이터를 찾을 수 없습니다.' }, { status: 404 });
		}

		// 2. 파일 폴더 복원 (src/trash → public/uploads)
		for (const project of projectsToRestore) {
			const trashPath = path.join(trashRoot, project.trashFolderName);
			const restorePath = path.join(uploadsRoot, project.id);

			try {
				await fs.rename(trashPath, restorePath);
				console.log(`폴더 복원 성공: ${project.trashFolderName} → uploads/${project.id}`);
			} catch (err: any) {
				// 폴더가 없어도 데이터는 복원 (파일 없는 프로젝트일 수 있음)
				console.warn(`폴더 복원 실패 (${project.id}): ${err.message}`);
			}
		}

		// 3. testDB에 프로젝트 복원 (휴지통 전용 필드 제거)
		const mainData = await fs.readFile(DBpath, 'utf-8');
		const mainDB: any[] = JSON.parse(mainData);

		const restoredProjects = projectsToRestore.map(({ deletedAt, trashFolderName, ...rest }) => rest);
		const updatedDB = [...mainDB, ...restoredProjects];

		// 4. 두 DB 동시 저장
		await Promise.all([
			fs.writeFile(DBpath, JSON.stringify(updatedDB, null, 4), 'utf-8'),
			fs.writeFile(trashDBPath, JSON.stringify(updatedTrashDB, null, 4), 'utf-8'),
		]);

		console.log(`[복원 완료] ID: ${targetIds.join(', ')}`);

		return NextResponse.json({
			message: `${projectsToRestore.length}건이 복원되었습니다.`,
			restoredCount: projectsToRestore.length
		}, { status: 200 });

	} catch (error) {
		return NextResponse.json({ message: '복원 실패!', error }, { status: 500 });
	}
}