"use client";

import React, { useState } from "react";

export default function ProfileEditForm({ data }: { data: any }) {
	const [profile, setProfile] = useState(data);

	return (
		<div className="tab-fade-in">
			<header className="content-header">
				<h2>내 정보 설정</h2>
				<p>서비스에서 사용하는 개인 정보를 관리합니다.</p>
			</header>

			<section className="profile-upload-section">
				<div className="avatar-wrapper">
					<img src={profile.titleimage[0].url} alt="Profile" />
					<label className="edit-overlay" htmlFor="avatar-upload">변경</label>
					<input type="file" id="avatar-upload" hidden />
				</div>
				<div className="info-text">
					<h3>프로필 사진</h3>
					<p>JPG, PNG 형식의 이미지를 업로드해주세요. (최대 2MB)</p>
				</div>
			</section>

			<form className="profile-form" onSubmit={(e) => e.preventDefault()}>
				<div className="grid">
					<div className="item">
						<small className="label">이름</small>
						<label><input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
					</div>

					<div className="item" style={{ gridRow: "2", gridColumn: "1" }}>
						<small className="label">이메일</small>
						<label><input type="email" value={profile.email} disabled /></label>
					</div>

					<div className="item" style={{ gridRow: "2", gridColumn: "2" }}>
						<small className="label">연락처</small>
						<label><input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
					</div>


					<div className="item  " style={{ gridRow: "3", gridColumn: "1 / span 2" }}>
						<small className="label">자기소개</small>
						<label><textarea rows={4} value={profile.business.bio} onChange={(e) => setProfile({ ...profile.business, bio: e.target.value })} /></label>
					</div>
				</div>


				<div className="bottom-btn-wrap gap-2">
					<button type="button" className="btn default">취소</button>
					<button type="submit" className="btn primary">변경사항 저장</button>
				</div>
			</form>

		</div>


	);
}