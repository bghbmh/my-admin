"use client";
import "./icon-text.scss";

export default function Icon({ title, className }: { title: string; className?: string }) {
	return (
		<div className={`icon-text ${className || ""}`}>
			{title}
		</div>
	)
}