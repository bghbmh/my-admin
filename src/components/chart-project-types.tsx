"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LabelList,
} from "recharts";
import "./ChartProjectTypes.scss";
import { MAIN_CATEGORY } from "@/constants/config";
import { ProjectDataType } from "@/types/project.data";

interface ChartProps {
	list: ProjectDataType[];
}

export default function ChartProjectTypes({ list }: ChartProps) {
	const category = MAIN_CATEGORY
		.filter(cat => cat.name !== "알 수 없음")
		.reduce((acc, cat) => {
			acc[cat.name] = 0;
			return acc;
		}, {} as Record<string, number>);

	// 1. 데이터 가공: 카테고리별 프로젝트 개수 계산
	const categoryCounts = list.reduce((acc: any, p) => {
		acc[p.category[0].name] = (acc[p.category[0].name] || 0) + 1;
		return acc;
	}, { ...category });

	// 2. Recharts 형식으로 변환
	const chartData = Object.keys(categoryCounts).map((key) => ({
		name: key,
		count: categoryCounts[key],
	}));

	// 브랜드 컬러 정의 (디자인에 맞춰 수정 가능)
	const COLORS = ["#00B69B"];

	return (
		<div className="chart-wrapper" >
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
				>
					{/* 배경선 제거 혹은 점선 처리 */}
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

					<XAxis
						dataKey="name"
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 12, fill: "#666" }}
					/>

					{/* 수치는 툴팁으로 대체하거나 커스텀 레이블 사용 가능 */}
					<YAxis hide />

					<Tooltip
						cursor={{ fill: "transparent" }}
						content={({ active, payload, label }) => {
							if (active && payload && payload.length) {
								return (
									<div style={{
										backgroundColor: "#fff",
										padding: "8px 12px",
										border: "1px solid #00B69B",
										borderRadius: "6px",
										fontSize: "13px",
										boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
									}}>
										{/* label(카테고리명)과 value(숫자)를 바로 사용 */}
										<div style={{ fontWeight: "bold", color: "#333" }}>{label}</div>
										<div style={{ color: "#00B69B", marginTop: "4px" }}>
											{payload[0].value}개
										</div>
									</div>
								);
							}
							return null;
						}}
					/>

					<Bar
						dataKey="count"
						fill={COLORS[0]}
						radius={[4, 4, 0, 0]}
						barSize={40}
					>
						{/* 2. 막대 위에 개수를 표시하는 설정 */}
						<LabelList
							dataKey="count"
							position="top"   // 막대 상단에 위치
							offset={10}      // 막대와의 간격
							fill="#686868"      // 글자 색상
							fontSize={12}    // 글자 크기
							formatter={(val: any) => `${val}개`}
						/>
					</Bar>

					{/* <Bar
						dataKey="count"
						radius={[4, 4, 0, 0]}
						barSize={40}
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Bar> */}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}