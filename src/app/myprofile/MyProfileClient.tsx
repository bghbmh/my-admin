"use client";

import React, { useState } from "react";
import "./my-profile.scss";

// 각 탭별 서브 컴포넌트들
import ProfileEditForm from "./ProfileEditForm";
import PasswordChangeForm from "./PasswordChangeForm";
import NotificationSettings from "./NotificationSettings";
import LogoutConfirm from "./LogoutConfirm";

export default function MyProfileClient({ info }: { info: any }) {
	const [activeTab, setActiveTab] = useState("profile");

	const tabs = [
		{ id: "profile", label: "내 정보 관리" },
		{ id: "password", label: "비밀번호 변경" },
		{ id: "notification", label: "알림 설정" },
		{ id: "logout", label: "로그아웃" },
	];

	// 현재 탭에 맞는 컴포넌트 렌더링 함수
	const renderContent = () => {
		switch (activeTab) {
			case "profile": return <ProfileEditForm data={info} />;
			case "password": return <PasswordChangeForm />;
			case "notification": return <NotificationSettings />;
			case "logout": return <LogoutConfirm />;
			default: return <ProfileEditForm data={info} />;
		}
	};

	return (
		<div className="profile-settings-container">
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

			<main className="settings-content">
				{renderContent()}
			</main>
		</div>
	);
}