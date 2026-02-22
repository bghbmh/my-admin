"use client";

import React from "react";

// 아이템 하나하나의 생김새 정의
// interface RadioItem {
// 	type: number | string;
// 	name: string;
// 	icon?: string;
// }

interface Props {
	listname: string;
	id: string;
	label: string;
	value: string;
	onChange: (
		listname: any,
		id: string,
		name: string,
		value: string
	) => void;
	onDelete: (listname: any, id: string) => void; // 선택 시 아이템 전체를 넘겨줌
}

export default function ExtraInfoItem({ listname, id, label, value, onChange, onDelete }: Props) {
	return (<>
		<div className="extra-info-group__item">
			<label className="info-label">
				<span className="guide">라벨</span>
				<input
					type="text"
					name="label"
					value={label}
					placeholder="라벨"
					onChange={e => onChange(listname, id, e.target.name, e.target.value)}
				/>
			</label>
			<label className="info-value">
				<span className="guide">내용</span>
				<input
					type="text"
					name="value"
					value={value}
					placeholder="내용"
					onChange={e => onChange(listname, id, e.target.name, e.target.value)}
				/>
			</label>
			<button
				type="button"
				className="btn delete-one"
				onClick={() => onDelete(listname, id)}
			>삭제</button>
		</div>
	</>);
}