"use client";

import { useState, useEffect } from "react";
import "./header-user-info.scss";
import ThemeToggle from "./form/theme-toggle";
import UserVisual from "./user-image";

interface Props {
	profile: any; // 전달받을 프로필 데이터
}



export default function HeaderUserInfo({ profile }: Props) {

	// const [imageUrl, setImageUrl] = useState<string>("");
	// const [isLoaded, setIsLoaded] = useState(false);

	// useEffect(() => {
	// 	if (profile) {
	// 		// 1. 테마 초기 설정
	// 		document.body.dataset.theme = profile.theme;

	// 		// 2. 이미지 로드 로직 (기존 getFileUrl 모사)
	// 		// 실제 API 호출이 필요하다면 여기서 수행합니다.
	// 		if (profile.image?.main) {
	// 			setImageUrl(profile.image.main); // 우선 profile 안의 경로 사용 예시
	// 			setIsLoaded(true);
	// 		}
	// 	}
	// }, [profile]);

	// if (!profile) return <div className="user-loading">데이터 없음</div>;

	const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTheme = e.target.checked ? "dark" : "light";
		document.body.dataset.theme = newTheme;
		// 필요 시 여기서 DB 업데이트 fetch를 호출하세요.
	};

	return (
		<div className="header-user-info-wrap">
			<div className="user">
				<button type="button" className="ctrl-modal" onClick={() => console.log("모달 열기")}>
					<i className="icon-svg-chevron-right" aria-hidden="true"></i>
				</button>

				<div className="info">
					<div className="option-wrap">
						<small className="option">
							{profile.nickname.check ? "별명 사용 중 " : "별명 사용 안함 "}
							<i className={`icon-svg-check-circle-fill ${profile.nickname.check ? 'primary' : ''}`} />
						</small>
						<ThemeToggle initialTheme={profile.theme} />
					</div>

					<div className="main">
						<strong className="name">
							{profile.nickname.check ? profile.nickname.value : profile.name}
						</strong>
						<div className="extra-info">
							<span className="item">{profile.business.position}</span>
							<span className="item">{profile.business.team}</span>
							<span className="item">{profile.business.company}</span>
						</div>
					</div>

					<div className="btn-wrap">
						<button type="button" className="btn">
							<i className="icon-svg-user1" /> 내정보
						</button>
					</div>
				</div>

				<UserVisual
					src={profile.image.main.webUrl}
					alt={profile.name}
				/>

			</div>
		</div>
	);
}