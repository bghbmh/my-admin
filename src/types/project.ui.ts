import { UploadFile } from "antd";
import { ProjectDataType, DefaultFileType, DEFAULT_PROJECT_DATA } from "./project.data";
import { uploadToCloudinary } from "@/utils/cloudinary";

// 1. UI에서만 사용하는 확장 타입 정의
// export interface UiMockupFile extends UploadFile {
// 	label: string; // 목업 섹션에서 사용하는 라벨 필드
// }


// 2. 전체 폼을 위한 UI 전용 타입 (Omit 사용)
export interface UiProjectFormDataType extends Omit<ProjectDataType, 'titleImage' | 'subimage' | 'imageComparison'> {
	titleImage: UploadFile[];
	subimage: UploadFile[];
	imageComparison: {
		use: boolean;
		before: UploadFile[];
		after: UploadFile[];
	};
}

export const EMPTY_UI_DATA: UiProjectFormDataType = {
	...DEFAULT_PROJECT_DATA,
	titleImage: [],
	subimage: [],
	imageComparison: { use: false, before: [], after: [] } // 배열로 초기화
};

/**
 * DB 이미지 데이터를 Ant Design UploadFile 형식으로 통합 변환
 * @param files - 단일 객체 또는 객체 배열
 * @param prefix - uid 생성을 위한 구분자
 */
export const transformToUiFileList = (
	files: any | any[] | null,
	prefix: string = 'img'
): UploadFile[] => {
	if (!files) return [];

	// 단일 객체인 경우 배열로 감싸서 처리 루프를 통일합니다.
	const fileArray = Array.isArray(files) ? files : [files];

	return fileArray
		.filter(file => file && file.url) // 유효한 데이터만 추출
		.map((file, idx) => ({
			uid: `${prefix}-${idx}-${file.url}`,
			name: file.name || `${prefix}-${idx}`,
			status: 'done',
			url: file.url.startsWith('http') ? file.url : `/uploads/${file.url}`,
			size: file.size,
			type: file.type,
			// 기존 DB 데이터이므로 originFileObj는 없습니다.
		}));
};

// 목업 리스트 변환 (MockupFileType[] -> UiMockupFile[])
// export const transformToUiMockupList = (mockups: MockupFileType[]): UiMockupFile[] => {
// 	if (!mockups) return [];
// 	return mockups.map((item, idx) => ({
// 		uid: `mock-${idx}-${item.url}`,
// 		name: item.name || `mockup-${idx}`,
// 		status: 'done',
// 		url: item.url.startsWith('http') ? item.url : `/uploads/${item.url}`,
// 		label: item.label || item.name,
// 		size: item.size || 0,
// 	}));
// };


/**
 * 1. 일반 이미지 변환 (Cloudinary 업로드 포함)
 * 대상: titleImage, subimage
 */
export const transformImagesToServer = async (uiFiles: UploadFile[]): Promise<DefaultFileType[]> => {
	if (!uiFiles || uiFiles.length === 0) return [];

	return Promise.all(uiFiles.map(async (file) => {
		let finalUrl = file.url || "";

		// 신규 파일(originFileObj 존재)인 경우에만 업로드
		if (file.originFileObj) {
			const uploadedUrl = await uploadToCloudinary(file.originFileObj as File);
			finalUrl = uploadedUrl || "";
		}

		return {
			alt: (file as any).alt || file.name || 'image',
			name: file.name,
			size: file.size || 0,
			type: file.type || '',
			lastModified: (file as any).lastModified || Date.now(),
			url: finalUrl,
		};
	}));
};

/**
 * 2. 목업 파일 변환 (로컬 저장 경로 규칙 적용)
 * 대상: mockup
 */
// export const transformMockupToServer = async (file: any, projectId: string): Promise<MockupFileType | null> => {
// 	if (!file) return null;

// 	// 목업은 업로드 로직을 handleSubmit에서 별도로 처리하므로, 여기서는 DB에 기록될 경로만 생성합니다.
// 	const finalUrl = file.originFileObj
// 		? `${projectId}/files/${file.name}`
// 		: file.url?.replace(/^\/uploads\//, "");

// 	return {
// 		label: file.label || file.name,
// 		alt: file.name,
// 		name: file.name,
// 		size: file.size || 0,
// 		type: file.type || '',
// 		lastModified: file.lastModified || 0,
// 		url: finalUrl,
// 	};
// };


/**
 * 3. 통합 변환 컨트롤러 (필요 시 선택해서 사용)
 */
// export const transformToServerFile = async (file: any, type: 'image' | 'mock', projectId?: string) => {
// 	if (type === 'mock') {
// 		return transformMockupToServer(file, projectId || '');
// 	}
// 	return transformImagesToServer(file);
// };