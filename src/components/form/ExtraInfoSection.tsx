import React from "react";
import ExtraInfoItem from "./ExtraInfoItem";
import { ExtraInfoItemType } from "@/types/project.data";

interface Props {
	items: ExtraInfoItemType[];
	onChange: (newList: ExtraInfoItemType[]) => void;
}

export default function ExtraInfoSection({ items, onChange }: Props) {
	const handleChange = (id: string, name: string, value: string) => {
		const newList = items.map(item =>
			item.id === id ? { ...item, [name]: value } : item
		);
		onChange(newList);
	};

	const handleDelete = (id: string) => {
		console.log("ss-", items)
		onChange(items.filter(item => item.id !== id));
	};

	const handleAdd = () => {
		const newItem: ExtraInfoItemType = {
			id: crypto.randomUUID(),
			label: "",
			value: ""
		};
		onChange([...items, newItem]);
	};
	return (
		<div className="extra-info-group">
			{items.map(item => (
				<ExtraInfoItem
					key={item.id}
					id={item.id}
					label={item.label}
					value={item.value}
					listname="extraInfo"
					onChange={handleChange}
					onDelete={handleDelete}
				/>
			))}
			<button type="button" className="btn add-item" onClick={handleAdd}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>추가
			</button>
		</div>
	);
}

