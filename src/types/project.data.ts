export interface CategoryItemType {
	name: string;
	type: string;
	label: "main" | "sub";
}

export interface ExtraInfoItemType {
	id: string;
	label: string;
	value: string;
}

export interface ExternalLinkType {
	id: string;
	label: string;
	url: string;
}

export interface MockupFileType {
	label: string;
	alt: string;
	name: string;
	size: number | null;
	type: string;
	lastModified: number | null;
	webUrl: string;
}

export interface ProjectDataType {
	id: string | '';
	mainOpen: boolean;
	mainOpenImages: string[];
	category: CategoryItemType[];
	hash: string[];
	title: string;
	description: string;
	extraInfo: ExtraInfoItemType[];
	mainimage: any[];
	subimage: any[];
	mockup: MockupFileType[];
	externalLink: ExternalLinkType[];
	projectNum: number;
	currentState: string;
	startDate: string;
	endDate: string;
	member: any[];
	registerDate: number;
	modifyDate: number[];
}