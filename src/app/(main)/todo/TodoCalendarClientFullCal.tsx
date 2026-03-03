"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// SCSS는 별도로 만드셔도 되고, 여기서 라이브러리 스타일을 커스텀합니다.
import "./calendar-custom.scss";

export default function TodoCalendarClientFullcal() {
	return (
		<div className="todo-calendar-wrapper">
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				locale="ko" // 한국어 설정
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,dayGridWeek",
				}}
				height="auto"
				editable={true} // 나중에 드래그 앤 드롭 연동을 위해
				selectable={true}
				events={[
					// 샘플 데이터: 나중에 프로젝트 리스트와 연동할 부분
					{ title: "샘플 프로젝트 마감", start: "2024-03-20", end: "2024-03-22", color: "#f00" },
				]}
				eventClick={(info) => {
					alert('클릭한 일정: ' + info.event.title);
				}}
			/>
		</div>
	);
}