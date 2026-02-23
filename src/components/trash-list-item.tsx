// src/components/trash-list-item.tsx

import { TrashItemType } from "@/types/trash.data";
import { MAIN_CATEGORY, STATE_STEP } from "@/constants/config";
import "./projects-list-item.scss"; // ✅ 기존 scss 그대로 재사용!

interface Props {
	item: TrashItemType;
	isSelected: boolean;
	onSelected: (checked: boolean, id: string) => void;
	onRestore: (id: string) => void;  // 단건 복원용
}

export default function TrashListItem({ item, isSelected, onSelected, onRestore }: Props) {

	const mainCategoryInfo = MAIN_CATEGORY.find(mc => mc.type === Number(item.category[0]?.type));
	const stateInfo = STATE_STEP.find(state => state.type === item.currentState);
	const deletedDate = new Date(item.deletedAt).toLocaleDateString("ko-KR");

	return (
		<div className="project-list-item">
			{/* 체크박스 - 기존과 동일 */}
			<label aria-label="항목선택" className="cb">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={e => onSelected(e.target.checked, item.id)}
				/>
			</label>

			{/* 정보 영역 - 기존과 동일 */}
			<div className="info">
				<div className={`category c-type-${mainCategoryInfo?.type}`}>
					<i className={mainCategoryInfo?.icon} aria-hidden="true"></i>
					<dl className="text">
						<dt data-type={item.category[0]?.type}>{item.category[0]?.name}</dt>
						<dd data-type={item.category[1]?.type}>{item.category[1]?.name}</dd>
					</dl>
				</div>
				<div className="title">
					<div className="text">{item.title || "제목 없음"}</div>
					{/* ✅ 삭제일 표시 (기존 날짜 자리에) */}
					<small>🗑 삭제일: {deletedDate}</small>
				</div>
			</div>

			{/* 상태 뱃지 - 기존과 동일 */}
			<div className={`state-${stateInfo?.type || "unknown"}`}>
				<i className={stateInfo?.icon} aria-hidden="true"></i>
				{stateInfo?.name}
			</div>

			{/* 버튼 - 복원만! */}
			<div className="btn-wrap">
				<button
					type="button"
					className="btn view-btn"
					onClick={() => onRestore(item.id)}
				>
					복원
				</button>
			</div>
		</div>
	);
}