import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const files = formData.getAll("files") as File[];
		const projectId = formData.get("projectId") as string;

		if (!files || files.length === 0) {
			return NextResponse.json({ message: "업로드할 파일이 없습니다." }, { status: 400 });
		}

		const baseDir = path.join(process.cwd(), "public", "uploads", projectId);
		const savedFiles = [];

		for (const file of files) {
			const buffer = Buffer.from(await file.arrayBuffer());
			const fileName = file.name;

			// 1. 확장자에 따른 폴더명 결정 (images 또는 files)
			const folderName = getFolderName(fileName);

			// 2. 최종 저장될 폴더 경로 (public/uploads/ID/images 등)
			const targetDir = path.join(baseDir, folderName);

			// 3. ★ 핵심: 해당 하ative 폴더가 없으면 생성 (recursive: true 덕분에 상위 폴더까지 한 번에 생성됨)
			await fs.mkdir(targetDir, { recursive: true });

			// 4. 파일 저장
			const filePath = path.join(targetDir, fileName);
			await fs.writeFile(filePath, buffer);

			savedFiles.push(`${folderName}/${fileName}`);
		}

		return NextResponse.json({ message: "파일 업로드 성공", files: savedFiles });
	} catch (error) {
		console.error("파일 업로드 오류:", error);
		return NextResponse.json({ message: "파일 저장 실패" }, { status: 500 });
	}
}

function getFolderName(fileName: string) {
	const ext = path.extname(fileName).toLowerCase();
	const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
	return imageExts.includes(ext) ? 'images' : 'files';
}