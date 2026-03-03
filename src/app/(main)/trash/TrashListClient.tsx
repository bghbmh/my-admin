// src/app/trash/TrashListClient.tsx

"use client";

import { useState } from "react";
import { useProjectRestore } from "@/hooks/useProjectRestore";
import { TrashItemType } from "@/types/trash.data";
import TrashListItem from "@/components/trash-list-item";
import SectionHeader from "@/components/common/section-header";

interface Props {
	list: TrashItemType[];
}

export default function TrashListClient({ list }: Props) {

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { isRestoring, handleProjectRestore } = useProjectRestore();

	const handleSelect = (checked: boolean, id: string) => {
		setSelectedIds(prev =>
			checked ? [...prev, id] : prev.filter(prevId => prevId !== id)
		);
	};

	const handleCancel = () => setSelectedIds([]);

	// 단건 복원 (버튼 클릭)
	const handleSingleRestore = (id: string) => {
		handleProjectRestore([id]);
	};

	if (list.length === 0) {
		return <p className="empty-message">🗑 휴지통이 비어있습니다.</p>;
	}

	return (
		<>
			<SectionHeader
				title={
					<>
						<i className="icon-svg2-me" aria-hidden="true"></i>
						<h3 className="text">휴지통</h3>
						{selectedIds.length > 0 && <small className="selected-count"> <b className="fcPrimary font-monospace">{selectedIds.length}</b>개 선택됨</small>}

					</>
				}
				actions={selectedIds.length > 0 && (
					<div className="btn-wrap">
						<button type="button" onClick={handleCancel} className="btn cancel">취소</button>
						<button
							type="button"
							className="btn primary"
							onClick={() => handleProjectRestore(selectedIds, () => setSelectedIds([]))}
							disabled={isRestoring}
						>
							{isRestoring ? "복원 중..." : `${selectedIds.length} 건 복원`}
						</button>
					</div>
				)}
			/>

			{/* 목록 - 기존 projects-list 클래스 재사용 */}
			< section className="projects-list" >
				{
					list.map(item => (
						<TrashListItem
							key={item.id}
							item={item}
							isSelected={selectedIds.includes(item.id)}
							onSelected={handleSelect}
							onRestore={handleSingleRestore}
						/>
					))
				}
			</section >
		</>
	);
}