"use client";

import React, { useState, useEffect, useMemo } from "react";
import "./calendar-week.scss";

const MOCK_EVENTS = [
	{ id: 1, title: "디자인 시스템 구축", start: "2026-03-02", end: "2026-03-04", color: "#6366f1" },
	{ id: 2, title: "API 연동 작업", start: "2026-03-04", end: "2026-03-05", color: "#10b981" },
	{ id: 3, title: "기획서 검토", start: "2026-03-06", end: "2026-03-06", color: "#f59e0b" },
];

export default function TodoCalendarClient() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	const sunday = useMemo(() => {
		const date = new Date(currentDate);
		const day = date.getDay();
		const diff = date.getDate() - day;
		return new Date(date.setDate(diff));
	}, [currentDate]);

	const weekDays = useMemo(() => {
		return Array.from({ length: 7 }, (_, i) => {
			const day = new Date(sunday);
			day.setDate(sunday.getDate() + i);
			return day;
		});
	}, [sunday]);

	const moveWeek = (offset: number) => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() + offset * 7);
		setCurrentDate(newDate);
	};

	const formatDate = (date: Date) => {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	};

	const getNowPosition = () => {
		const dayIdx = now.getDay();
		const totalMinutes = now.getHours() * 60 + now.getMinutes();
		return ((dayIdx + (totalMinutes / 1440)) / 7) * 100;
	};

	const startOfWeek = new Date(sunday).setHours(0, 0, 0, 0);
	const endOfWeek = new Date(sunday).getTime() + (7 * 24 * 60 * 60 * 1000);
	const isCurrentWeek = now.getTime() >= startOfWeek && now.getTime() < endOfWeek;

	return (
		<div className="scheduler-card">
			<div className="scheduler-nav">
				<div className="date-info">
					<h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
					<span className="week-badge">주간 일정</span>
				</div>
				<div className="btn-group">
					<button onClick={() => moveWeek(-1)} className="nav-btn">이전</button>
					<button onClick={() => setCurrentDate(new Date())} className="today-btn">오늘</button>
					<button onClick={() => moveWeek(1)} className="nav-btn">다음</button>
				</div>
			</div>

			<div className="scheduler-body">
				<div className="week-grid-container">
					{isCurrentWeek && (
						<div className="now-indicator" style={{ left: `${getNowPosition()}%` }}>
							<div className="now-badge">
								{String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
							</div>
							<div className="now-line"></div>
						</div>
					)}

					<div className="grid-background">
						{weekDays.map((date, i) => (
							<div key={i} className={`grid-column ${date.toDateString() === now.toDateString() ? 'is-today' : ''}`}>
								<div className="column-header">
									<span className="day-name">{['일', '월', '화', '수', '목', '금', '토'][i]}</span>
									<span className="day-num">{date.getDate()}</span>
								</div>
							</div>
						))}
					</div>

					<div className="event-layer">
						{MOCK_EVENTS.map((event) => {
							const startIdx = weekDays.findIndex(d => formatDate(d) === event.start);
							const endIdx = weekDays.findIndex(d => formatDate(d) === event.end);
							if (startIdx === -1 && endIdx === -1) return null;
							const actualStart = startIdx === -1 ? 0 : startIdx;
							const actualEnd = endIdx === -1 ? 6 : endIdx;
							const duration = actualEnd - actualStart + 1;

							return (
								<div key={event.id} className="event-bar"
									style={{ gridColumnStart: actualStart + 1, gridColumnEnd: `span ${duration}`, backgroundColor: event.color }}>
									<span className="event-title">{event.title}</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}