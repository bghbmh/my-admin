"use client";

import React, { useState, useRef, useEffect } from "react";
// ProjectIcon 파일의 경로에 맞춰 import 하세요
import { ProjectIcon, ICONSET, IconType } from "@/types/icon.data";

interface Props {
	id: string;
	label: string;
	url: string;
	type: string;
	onChange: (id: string, name: string, value: string) => void;
	onDelete: (id: string) => void;
}

export default function ExternalLinkItem({ id, label, url, type, onChange, onDelete }: Props) {
	// 1. 아이콘 목록 열림 상태 관리
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const availableTypes: IconType[] = ['link', 'figma', 'github', 'mockup', 'homepage'];

	// 2. 외부 클릭 시 목록 닫기 로직
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleTypeSelect = (typeName: string) => {
		onChange(id, 'type', typeName);
		setIsOpen(false); // 선택 후 닫기
	};

	return (
		<div className="outlink-group__item">
			{/* 아이콘 선택 드롭다운 영역 */}
			<div className="type-selector-wrapper" ref={dropdownRef}>
				{/* 현재 선택된 아이콘 버튼 */}
				<button
					type="button"
					className={`current-type-btn ${isOpen ? 'active' : ''}`}
					onClick={() => setIsOpen(!isOpen)}
				>
					<ICONSET type={type} />
					<span className="arrow-down">▼</span>
				</button>

				{/* 클릭 시 나타나는 아이콘 목록 */}
				{isOpen && (
					<div className="icon-dropdown">
						{availableTypes.map((typeName) => (
							<button
								key={typeName}
								type="button"
								className={`icon-option ${type === typeName ? 'selected' : ''}`}
								onClick={() => handleTypeSelect(typeName)}
							>
								<ICONSET type={typeName} />
								<span className="icon-name">{typeName}</span>
							</button>
						))}
					</div>
				)}
			</div>

			<div className="input-fields">
				<input
					type="text"
					name="label"
					value={label}
					placeholder="라벨"
					onChange={e => onChange(id, e.target.name, e.target.value)}
				/>
				<input
					type="text"
					name="url"
					value={url}
					placeholder="주소"
					onChange={e => onChange(id, e.target.name, e.target.value)}
				/>
			</div>

			<button type="button" className="btn delete-one" onClick={() => onDelete(id)}>삭제</button>
		</div>
	);
}