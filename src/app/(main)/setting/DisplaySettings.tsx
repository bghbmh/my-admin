"use client";

import React from "react";

const DisplaySettings = () => {
	return (
		<div className="settings-form tab-fade-in">
			<header className="content-header">
				<h2>화면 설정</h2>
				<p>앱의 테마와 시각적 요소를 설정합니다.</p>
			</header>
			<div className="setting-row">
				<div className="info">
					<strong>다크 모드</strong>
					<p>어두운 테마를 적용하여 눈의 피로를 줄입니다.</p>
				</div>
				<label className="switch">
					<input type="checkbox" className="switch" />
				</label>
			</div>
			<div className="setting-row">
				<div className="info">
					<strong>시스템 언어</strong>
					<p>콘텐츠 표시 언어를 선택합니다.</p>
				</div>
				<label>
					<select className="action-select">
						<option value="ko">한국어</option>
						<option value="en">English</option>
					</select>
				</label>

			</div>
		</div>
	);
};

export default DisplaySettings;