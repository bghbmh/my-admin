
// hooks/usePagination.ts
import React, { useState, useEffect, useMemo } from "react";

export function usePagination<T>(list: T[], itemsInPages: number = 5, pageRange: number = 0) {
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [list.length]);

	const totalPages = useMemo(() => {
		return Math.ceil(list.length / itemsInPages);
	}, [list, itemsInPages]);

	// 화면에 표시할 페이지 번호 배열 계산
	// const pageNumbers = useMemo(() => {
	// 	const startPage = Math.max(1, currentPage - pageRange);
	// 	const endPage = Math.min(totalPages, currentPage + pageRange);

	// 	const range = [];
	// 	for (let i = startPage; i <= endPage; i++) {
	// 		range.push(i);
	// 	}
	// 	return range;
	// }, [currentPage, totalPages, pageRange]);

	const pageNumbers = useMemo(() => {
		// 1. 전체 버튼 개수 설정 (예: range가 1이면 좌+우+현재 = 3개)
		const displayCount = pageRange * 2 + 1;

		let startPage = Math.max(1, currentPage - pageRange);
		let endPage = Math.min(totalPages, startPage + displayCount - 1);

		// 2. 뒤쪽 페이지가 부족해서 endPage가 totalPages에 고정될 경우, startPage를 앞으로 당김
		if (endPage - startPage + 1 < displayCount) {
			startPage = Math.max(1, endPage - displayCount + 1);
		}

		// 3. 앞쪽 페이지가 부족해서 startPage가 1에 고정될 경우, endPage를 뒤로 밀어줌
		if (endPage - startPage + 1 < displayCount) {
			endPage = Math.min(totalPages, startPage + displayCount - 1);
		}

		const range = [];
		for (let i = startPage; i <= endPage; i++) {
			range.push(i);
		}
		return range;
	}, [currentPage, totalPages, pageRange]);

	const paginatedList = useMemo(() => {
		const start = (currentPage - 1) * itemsInPages;
		return list.slice(start, start + itemsInPages);
	}, [list, currentPage, itemsInPages]);

	return {
		currentPage,
		setCurrentPage,
		totalPages,
		paginatedList,
		pageNumbers
	}


}