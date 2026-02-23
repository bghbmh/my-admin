
import { ProjectDataType } from "./project.data";

export interface TrashItemType extends ProjectDataType {
	deletedAt: number;        // 삭제된 시각 (timestamp)
	trashFolderName: string;  // src/trash 안의 실제 폴더명
}