import fs from "fs/promises";
import path from "path";

import PageHeader from "@/components/common/page-header";
import TrashListClient from "./TrashListClient";

export default async function TrashPage() {

	// trashDB.json 읽기 (없으면 빈 배열)
	const trashDBPath = path.join(process.cwd(), "data", "trashDB.json");

	let trashList: any[] = [];
	try {
		const fileContent = await fs.readFile(trashDBPath, "utf-8");
		trashList = JSON.parse(fileContent);
	} catch {
		trashList = [];
	}

	return (
		<>
			<PageHeader title="휴지통" />
			<div className="contents">
				<TrashListClient list={trashList} />
			</div>
		</>
	);
}