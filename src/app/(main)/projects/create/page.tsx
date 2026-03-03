
import PageHeader from "@/components/common/page-header";
import ProjectSectionHeader from "@/components/common/project-section-header";
import ProjectForm from "@/components/form/project-form";
import { DEFAULT_PROJECT_DATA } from "@/types/project.data";


export default function ProjectCreatePage() {

	return (
		<>
			{/* 1. 메뉴명 (1depth) */}
			<PageHeader title="프로젝트" mode="view" />

			{/* 2. 실제 콘텐츠 영역 (RootLayout의 main.common 안에 들어옴) */}
			<div id="main-common-container"  >
				<section className="section type2 project-detail" >
					<ProjectSectionHeader title='신규 프로젝트' mode="create" />

					{/* 3. 실제 입력 폼 */}
					<ProjectForm
						id=''
						initialData={DEFAULT_PROJECT_DATA}
						mode="create" />
				</section>

			</div>
		</>
	);
}
