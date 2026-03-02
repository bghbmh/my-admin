"use client";

import React from "react";

const DataManagement = () => {
	const handleExportJSON = () => {
		alert("데이터 내보내기를 시작합니다.");
		// 실제 구현 시: fetch('/api/export') 또는 로컬 데이터 Blob 생성 로직
	};

	return (
		<div className="settings-form tab-fade-in">
			<header className="content-header">
				<h2>데이터 관리</h2>
				<p>프로젝트 데이터를 안전하게 보관하거나 복구합니다.</p>
			</header>
			<div className="data-management">
				<div className="data-card">
					<div className="info">
						<strong>JSON 데이터 내보내기</strong>
						<p>현재 저장된 모든 프로젝트 데이터를 JSON 파일로 다운로드합니다.</p>
					</div>
					<button className="action-btn outline" onClick={handleExportJSON}>myDB.json 다운로드</button>
				</div>
				<div className="data-card">
					<div className="info">
						<strong>전체 데이터 초기화</strong>
						<p style={{ color: '#ef4444' }}>경고: 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
					</div>
					<button className="action-btn danger">전체 삭제</button>
				</div>
			</div>
		</div>
	);
};

export default DataManagement;