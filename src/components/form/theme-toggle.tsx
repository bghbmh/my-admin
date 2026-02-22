"use client";

import { useState, useEffect } from "react";
import "./theme-toggle.scss";

export default function ThemeToggle({ initialTheme = "light" }) {
	const [theme, setTheme] = useState(initialTheme);

	// 초기 테마 설정
	useEffect(() => {
		const savedTheme = document.body.dataset.theme || initialTheme;
		setTheme(savedTheme);
		document.body.dataset.theme = savedTheme;
	}, [initialTheme]);

	const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTheme = e.target.checked ? "dark" : "light";
		setTheme(newTheme);
		document.body.dataset.theme = newTheme;

		// 로컬 스토리지나 DB에 저장하는 로직을 여기에 추가할 수 있습니다.
		console.log(`테마가 ${newTheme}로 변경되었습니다.`);
	};

	return (
		<label className="toggle mode">
			<input
				type="checkbox"
				checked={theme === "dark"}
				onChange={toggleTheme}
				data-action="theme"
			/>
			{/* 스타일은 기존 SCSS를 그대로 사용하시면 됩니다 */}
		</label>

	);
}