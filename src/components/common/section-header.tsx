
import type { ReactNode } from "react";
import "./section-header.scss";


interface SectionHeaderProps {
	title: React.ReactNode;
	actions?: React.ReactNode;
}

export default function SectionHeader({ title, actions }: SectionHeaderProps) {
	return (
		<header className="section-header">
			<div className="title">{title}</div>
			{actions}
		</header>

	);
}