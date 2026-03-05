
//export const dynamic = 'force-dynamic';
//export const revalidate = 0;

import PageHeader from "@/components/common/page-header";
import SettingsClient from "./SettingsClient";

export default async function ArchivePage() {

	return (
		<>
			<PageHeader title="설정" />

			{/* 2. 실제 콘텐츠 영역 (RootLayout의 main.common 안에 들어옴) */}
			<div id="main-common-container"  >
				<SettingsClient />
			</div>
		</>
	);
}
