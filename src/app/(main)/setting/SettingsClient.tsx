"use client";

import React, { useState } from "react";
import './setting.scss';

// 분리한 컴포넌트들 임포트
import DisplaySettings from "./DisplaySettings";
import CategorySettings from "./CategorySettings";
import DataManagement from "./DataManagement";

export default function SettingsClient() {
	const [activeTab, setActiveTab] = useState("display");

	const tabs = [
		{ id: "display", label: "화면 설정" },
		{ id: "category", label: "카테고리 관리" },
		{ id: "data", label: "데이터 관리" },
	];

	const renderContent = () => {
		switch (activeTab) {
			case "display": return <DisplaySettings />;
			case "category": return <CategorySettings />;
			case "data": return <DataManagement />;
			default: return <DisplaySettings />;
		}
	};

	return (
		<div className="system-settings-container">
			{/* 상단 탭 네비게이션 */}
			<nav className="settings-tabs">
				<ul>
					{tabs.map((tab) => (
						<li
							key={tab.id}
							className={activeTab === tab.id ? "active" : ""}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</li>
					))}
				</ul>
			</nav>

			{/* 실제 내용 영역 */}
			<main className="settings-content">
				{renderContent()}
			</main>
		</div>
	);
}