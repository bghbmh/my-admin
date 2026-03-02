
import Link from "next/link";

import "./CategoryNavList.scss";

import { NO_ITEM_CONFIG, MAIN_CATEGORY } from "@/constants/config";
import { ProjectDataType } from "@/types/project.data";

export default function CategoryNavList({ list }: { list: ProjectDataType[] }) {

	// 1. 카테고리별 프로젝트 개수 계산 (Reduce)
	const category = MAIN_CATEGORY
		.filter(cat => cat.name !== "알 수 없음")
		.reduce((acc, cat) => {
			acc[cat.name] = 0;
			return acc;
		}, {} as Record<string, number>);

	// 1. 데이터 가공: 카테고리별 프로젝트 개수 계산
	const categoryCounts = list.reduce((acc: any, p) => {
		acc[p.category[0].name] = (acc[p.category[0].name] || 0) + 1;
		return acc;
	}, { ...category });

	return (
		<>
			<div className="category-nav-list">
				{MAIN_CATEGORY.filter((cat) => cat.name !== "알 수 없음").map(
					ca => (
						<Link
							key={ca.name}
							href={`/projects?category=${ca.type}`}
							className="link-item"
							scroll={false}>
							<i className={ca.icon} aria-hidden="true"></i>
							{ca.name === 'all' ? '모두보기' : ca.name}
							<span className="font-number fcPrimary">{categoryCounts[ca.name]}</span>
						</Link>
					)
				)}
			</div>
		</>

	);
}