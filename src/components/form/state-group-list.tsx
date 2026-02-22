"use client";

import React from "react";

// 아이템 하나하나의 생김새 정의
interface RadioItem {
	type: number | string;
	name: string;
	icon?: string;
}

interface Props {
	items: RadioItem[];
	groupName: string;
	selectedValue: string;
	onSelect: (item: RadioItem) => void; // 선택 시 아이템 전체를 넘겨줌
}

export default function StateGroupList({ items, groupName, selectedValue, onSelect }: Props) {
	return (
		<div className="state-group">
			{items.map((item) => (
				<label key={item.type} className="state-group__item">
					<input
						type="radio"
						name={groupName}
						value={item.type}
						checked={selectedValue === item.type}
						onChange={() => onSelect(item)} // 선택 시 부모에게 알림
					/>
					<span className="name">{item.name}</span>
					{/* 아이콘이 있을 때만 렌더링 */}
					{item.icon && <i className={item.icon} aria-hidden="true" />}
				</label>
			))}
		</div>
	);
}