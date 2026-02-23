// src/components/Pagination.tsx

import { useState, useMemo } from "react";

interface Props {
	currentPage: number;
	totalPages: number;
	pageNumbers: number[]
	onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, pageNumbers, onPageChange }: Props) {
	return (
		<div className="zPagination">
			<button className="page-link first" disabled={currentPage <= 1} onClick={() => onPageChange(1)}>처음</button>
			<button className="page-link prev" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>이전</button>

			{/* {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
				<button
					key={pageNumber}
					type="button"
					className={`page-link ${currentPage === pageNumber ? "current" : ""}`}
					onClick={() => onPageChange(pageNumber)}
				>
					{pageNumber}
				</button>
			))} */}

			{pageNumbers.map(pageNumber => (
				<button
					key={pageNumber}
					type="button"
					className={`page-link ${currentPage === pageNumber ? "current" : ""}`}
					onClick={() => onPageChange(pageNumber)}
				>
					{pageNumber}
				</button>
			))}

			<button className="page-link next" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>다음</button>
			<button className="page-link last" disabled={currentPage >= totalPages} onClick={() => onPageChange(totalPages)}>마지막</button>
		</div>
	);
}