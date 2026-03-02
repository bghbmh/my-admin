import PageHeader from "@/components/common/page-header";
import TodoCalendarClientFullcal from "./TodoCalendarClientFullCal";
import TodoCalendarClient from "./TodoCalendarClient";

export default async function TodoPage() {
	// 나중에 여기서 DB의 프로젝트 일정 데이터를 불러와서 Client로 넘겨줄 수 있습니다.

	return (
		<>
			<PageHeader title="할 일 관리" />
			<div id="main-common-container"  >
				<div className="calendar-container ">
					{/* 클라이언트 컴포넌트로 달력 로직 분리 
					
					<TodoCalendarClientFullcal />
					*/}
					<TodoCalendarClient />

				</div>
			</div>

		</>
	);
}