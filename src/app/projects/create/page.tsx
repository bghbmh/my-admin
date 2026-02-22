"use client";

import PageHeader from "@/components/common/page-header";
import ProjectSectionHeader from "@/components/common/section-header";
import ProjectForm from "@/components/form/project-form";
import { ProjectDataType } from "@/types/project.data";


export default function ProjectCreatePage() {

	const defaultData: ProjectDataType = {
		id: '',
		"mainOpen": false,
		"mainOpenImages": [],
		"category": [
			{ type: "0", name: "알 수 없음", label: "main" },
			{ type: "0", name: "알 수 없음", label: "sub" }
		],
		"hash": [],
		"title": "",
		"description": "",
		"extraInfo": [],
		"mainimage": [],
		"subimage": [],
		"mockup": [],
		"externalLink": [],
		"projectNum": 0,
		"currentState": "unknown",
		"startDate": "", //프로젝트 시작일
		"endDate": "", //프로젝트 종료일
		"member": [],
		"registerDate": 0,
		"modifyDate": []
	}

	return (
		<>
			{/* 1. 메뉴명 (1depth) */}
			<PageHeader title="프로젝트" mode="view" />

			{/* 2. 실제 콘텐츠 영역 (RootLayout의 main.common 안에 들어옴) */}
			<div className="contents">
				<section className="section type2 project-detail" >
					<ProjectSectionHeader title='신규 프로젝트' mode="create" />

					{/* 3. 실제 입력 폼 */}
					<ProjectForm
						id=''
						initialData={defaultData}
						mode="create" />
				</section>

			</div>
		</>
	);
}
