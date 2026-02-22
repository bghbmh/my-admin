"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import "./dropdown.scss";

export default function DropDownTypeA({ children }: { children: ReactNode }) {

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleDropdownToggle = () => setIsDropdownOpen(prev => !prev);

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleOutsideClick, true);
		}
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick, true);
		}
	}, [isDropdownOpen]);

	return (
		<>
			<div className="dropdown type-a" ref={dropdownRef}>
				<button
					type="button"
					className={`btn default round btn-toggle ${isDropdownOpen ? "active" : ""}`}
					title="버튼 목록 보기"
					aria-label="버튼 목록 보기"
					onClick={handleDropdownToggle}>
					<i className={isDropdownOpen ? "icon-svg-x-close" : "icon-svg-dots-vertical"} aria-hidden="true"></i>
				</button>
				<div
					className={`menu ${isDropdownOpen ? "open" : ""}`}
					onClick={() => setIsDropdownOpen(false)} // 메뉴 클릭 시 드롭다운 닫기
				>
					{children}
				</div>
			</div>
		</>
	);
}