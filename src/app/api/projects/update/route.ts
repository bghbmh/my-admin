import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {

	const updateP = await req.json();
	const DBpath = path.join(process.cwd(), 'data', 'testDB00.json');
	console.log('================================');
	const curData = await fs.readFile(DBpath, 'utf-8');
	try {
		console.log('updateP:', DBpath, updateP);
		console.log('000 ================================');

		const DB = JSON.parse(curData);


		const updatedDB = DB.map((p: any) =>
			p.id === updateP.id ? { ...p, ...updateP } : p
		);
		console.log('111 ================================');
		console.log('updatedDB:', updatedDB);

		await fs.writeFile(DBpath, JSON.stringify(updatedDB, null, 4), 'utf-8');

		return NextResponse.json({ message: '저장 성공!', data: updateP }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: '저장 실패!', error }, { status: 500 });
	}
}