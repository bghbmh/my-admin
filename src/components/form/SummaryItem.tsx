"use client";

import './SummaryItem.scss';
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
	onChange: (id: string, name: string, value: string) => void;
	onDelete: (id: string) => void; // 선택 시 아이템 전체를 넘겨줌
}

export default function SummaryItem({ id, label, value, onChange, onDelete }: Props) {
	return (<>
		<div className="summary-item-group__item">
			<label className="info-label">
				<span className="guide">제목</span>
				<input
					type="text"
					name="title"
					value={label}
					placeholder="라벨"
					onChange={e => onChange(id, e.target.name, e.target.value)}
				/>
			</label>
			{/* <span>:</span> */}
			<label className="info-value">
				<span className="guide">내용</span>
				<textarea
					name="description"
					rows={1}
					value={value}
					placeholder="내용"
					onChange={e => onChange(id, e.target.name, e.target.value)}
				/>
			</label>
			<button
				type="button"
				className="btn delete-one"
				onClick={() => onDelete(id)}
			>삭제</button>
		</div>
	</>);
}