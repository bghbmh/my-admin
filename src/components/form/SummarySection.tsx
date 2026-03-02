import React from "react";
import SummaryItem from "./SummaryItem";
import { OverviewSummaryType } from "@/types/project.data";

interface Props {
	items: OverviewSummaryType[] | null;
	onChange: (newList: OverviewSummaryType[]) => void;
}

export default function SummarySection({ items, onChange }: Props) {

	const list = items || []; // null 처리를 여기서 미리 해줌

	const handleChange = (id: string, title: string, value: string) => {
		const newList = list.map(item =>
			item.id === id ? { ...item, [title]: value } : item
		);
		onChange(newList); // 부모에겐 완성된 리스트만 보고
	};

	const handleDelete = (id: string) => {
		const newList = list.filter(item => item.id !== id);
		onChange(newList);
	};

	const handleAdd = () => {
		const newItem: OverviewSummaryType = {
			id: crypto.randomUUID(),
			title: "",
			description: ""
		};
		onChange([...list, newItem]);
	};

	return (
		<>
			<div className="summary-item-group">
				{
					list.map(item => (
						<SummaryItem
							key={item.id}
							listname="extraInfo"
							id={item.id}
							label={item.title}
							value={item.description}
							onChange={handleChange}
							onDelete={handleDelete}
						/>
					))
				}
			</div>
			<button type="button" className="btn add-item" onClick={handleAdd}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>추가
			</button>
		</>

	);

}