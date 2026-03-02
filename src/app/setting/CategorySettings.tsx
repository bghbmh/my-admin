"use client";

import React, { useState } from "react";

export default function CategorySettings() {
	const defaultCategories = [
		"html", "css", "javascript", "React", "Next.js",
		"TypeScript", "Tailwind CSS", "Figma", "Photoshop", "Illustrator"
	];

	const [selectedItems, setSelectedItems] = useState<string[]>(["html", "Photoshop"]);
	const [inputValue, setInputValue] = useState("");

	const handleToggleCategory = (name: string) => {
		if (selectedItems.includes(name)) {
			setSelectedItems(selectedItems.filter(item => item !== name));
		} else {
			setSelectedItems([...selectedItems, name]);
		}
	};

	const handleCustomAdd = () => {
		const trimmed = inputValue.trim();
		if (trimmed && !selectedItems.includes(trimmed)) {
			setSelectedItems([...selectedItems, trimmed]);
			setInputValue("");
		}
	};

	return (
		<div className="settings-form tab-fade-in">
			<header className="content-header">
				<h2>카테고리 및 기술 스택 관리</h2>
				<p>프로젝트에 사용될 기술 스택과 카테고리를 설정합니다.</p>
			</header>

			<div className="tool-form-container">
				<div className="selected-summary">
					<div className="title">선택된 항목</div>
					<div className="selected-chip-list">
						{selectedItems.map((item) => (
							<span key={item} className="selected-chip-list__item">
								{item}
								<button type="button" className="btn" onClick={() => handleToggleCategory(item)} />
							</span>
						))}
					</div>
				</div>

				<div className="chip-list-wrap">
					<b className="title">기본 항목</b>
					<div className="chip-list">
						{defaultCategories.map((cat) => (
							<label key={cat} className={`chip-outline ${selectedItems.includes(cat) ? 'active' : ''}`}>
								<input
									type="checkbox"
									checked={selectedItems.includes(cat)}
									onChange={() => handleToggleCategory(cat)}
									hidden
								/>
								{cat}
							</label>
						))}
					</div>
				</div>

				<div className="custom-tools-input">
					<b className="title">기타 직접 입력</b>
					<div className="d-flex gap-1">
						<input
							className="width-100per"
							placeholder="기술 이름 입력"
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<button type="button" className="btn dark" onClick={handleCustomAdd}>추가</button>
					</div>
				</div>
			</div>
		</div>
	);
}