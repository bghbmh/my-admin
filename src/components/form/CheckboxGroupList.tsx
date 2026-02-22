"use client";

import React from "react";

// 아이템 하나하나의 생김새 정의
// interface RadioItem {
// 	type: number | string;
// 	name: string;
// 	icon?: string;
// }

interface Props {
	items: string[];
	groupName: string;
	selectedValue: string[];
	onSelect: (isChecked: boolean, hash: string) => void; // 선택 시 아이템 전체를 넘겨줌
}

export default function CheckboxGroupList({ items, groupName, selectedValue, onSelect }: Props) {
	return (
		<div className="hash-wrap">
			{
				items.map((h) => (
					<label key={h}>
						<input
							type="checkbox"
							name={groupName}
							value={h}
							checked={selectedValue.includes(h)}
							onChange={e => onSelect(e.target.checked, h)}
						/>
						<span className="name">{h}</span>
					</label>
				))
			}
		</div>
	);
}