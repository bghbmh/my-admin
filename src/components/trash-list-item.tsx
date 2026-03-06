// src/components/trash-list-item.tsx
import { useState, useEffect } from "react";
import { ProjectDataType } from "@/types/project.data";
import { MAIN_CATEGORY, STATE_STEP } from "@/constants/config";
import "./projects-list-item.scss"; // 기존 스타일 재사용

interface Props {
	item: ProjectDataType;
	isSelected: boolean;
	onSelected: (checked: boolean, id: string) => void;
	onRestore: (id: string[]) => void;
}

export default function TrashListItem({ item, isSelected, onSelected, onRestore }: Props) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// 1. 카테고리 및 상태 정보 매칭
	const mainCategoryInfo = MAIN_CATEGORY.find(mc => mc.type === Number(item.category[0]?.type));
	const stateInfo = STATE_STEP.find(state => state.type === item.currentState);

	// 2. 삭제일 포맷팅 (deletedAt이 null일 경우를 대비한 방어 코드)
	const deletedDate = item.deletedAt
		? new Date(item.deletedAt).toLocaleDateString("ko-KR", {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		})
		: "날짜 정보 없음";

	return (
		<div className={`project-list-item ${isSelected ? "selected" : ""}`}>
			{/* 체크박스 */}
			<label aria-label="항목선택" className="cb">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={e => onSelected(e.target.checked, item.id)}
				/>
			</label>

			{/* 정보 영역 */}
			<div className="info">
				<div className={`category c-type-${mainCategoryInfo?.type || '6'}`}>
					<i className={mainCategoryInfo?.icon || 'icon-svg2-folder'} aria-hidden="true"></i>
					<dl className="text">
						<dt>{item.category[0]?.name || "기타"}</dt>
						<dd>{item.category[1]?.name || ""}</dd>
					</dl>
				</div>
				<div className="title">
					<div className="text" style={{ fontWeight: 'bold' }}>{item.title || "제목 없음"}</div>
					{/* 삭제일 표시 - 가독성을 위해 스타일 살짝 보정 */}
					<div style={{ marginTop: '4px', fontSize: '12px', color: '#888' }}>
						<i className="icon-svg2-trash" style={{ marginRight: '4px' }}></i>
						삭제일: {mounted ? deletedDate : ""}
					</div>
				</div>
			</div>

			{/* 상태 뱃지 */}
			<div className={`state-${stateInfo?.type || "unknown"}`}>
				<i className={stateInfo?.icon} aria-hidden="true"></i>
				{stateInfo?.name || "알 수 없음"}
			</div>

			{/* 작업 버튼 */}
			<div className="btn-wrap">
				<button
					type="button"
					className="btn dark" // 'view-btn' 대신 강조 컬러 사용 권장
					onClick={() => onRestore([item.id])}
					style={{ minWidth: '80px' }}
				>
					복원하기_
				</button>
			</div>
		</div>
	);
}