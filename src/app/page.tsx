
import PageHeader from "@/components/common/page-header";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<PageHeader title="대시보드_test" />
			aaa<br />
			<Link href="/projects" className="btn list">프로젝트 목록</Link><br /><br />
			<Link href="/projects/create" className="btn dark round">프로젝트 생성</Link>
		</>
	);
}
