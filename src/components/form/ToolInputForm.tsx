"use client";

import React, { useState, useEffect } from 'react';
import { DEFAULT_TOOL_LIST } from '@/constants/config';

import "./ToolInputForm.scss";

interface Props {
	tools: string[];
	onChange: (finalTools: string[]) => void;
}

export default function ToolInputForm({ tools, onChange }: Props) {
	const [selectedDefault, setSelectedDefault] = useState<string[]>([]);
	const [customTools, setCustomTools] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState(""); // 직접 입력용 단일 상태

	useEffect(() => {
		if (tools && tools.length > 0) {
			const defaults = tools.filter(t => DEFAULT_TOOL_LIST.includes(t));
			const customs = tools.filter(t => !DEFAULT_TOOL_LIST.includes(t));
			setSelectedDefault(defaults);
			setCustomTools(customs);
		}
	}, [tools]);

	// 통합 변경 전송 함수
	const triggerChange = (updatedDefault: string[], updatedCustom: string[]) => {
		onChange([...updatedDefault, ...updatedCustom]);
	};

	// 상단 배지 삭제 핸들러 (기본/직접입력 공통)
	const handleRemoveTag = (tool: string) => {
		let nextDefault = selectedDefault;
		let nextCustom = customTools;

		if (DEFAULT_TOOL_LIST.includes(tool)) {
			nextDefault = selectedDefault.filter(t => t !== tool);
			setSelectedDefault(nextDefault);
		} else {
			nextCustom = customTools.filter(t => t !== tool);
			setCustomTools(nextCustom);
		}
		triggerChange(nextDefault, nextCustom);
	};

	// 체크박스 핸들러
	const handleCheckChange = (tool: string) => {
		const next = selectedDefault.includes(tool)
			? selectedDefault.filter(t => t !== tool)
			: [...selectedDefault, tool];
		setSelectedDefault(next);
		triggerChange(next, customTools);
	};

	// 직접 입력 '추가' 버튼 핸들러
	const handleAddCustom = () => {
		const trimmedValue = inputValue.trim();
		if (!trimmedValue) return;

		// 중복 방지 (기본 리스트나 이미 추가된 커스텀 리스트에 있는지 확인)
		if (selectedDefault.includes(trimmedValue) || customTools.includes(trimmedValue)) {
			alert("이미 추가된 항목입니다.");
			return;
		}

		const nextCustom = [...customTools, trimmedValue];
		setCustomTools(nextCustom);
		setInputValue(""); // 입력창 비우기
		triggerChange(selectedDefault, nextCustom);
	};

	return (
		<div className="tool-form-container" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>

			{/* 1. 선택된 항목 요약 (태그 형태) */}
			<div className="selected-summary" style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
				<div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '8px' }}>선택된 항목</div>
				<div className='selected-chip-list mb-3'>
					{(selectedDefault.length === 0 && customTools.length === 0) ? (
						<span style={{ color: '#ccc', fontSize: '12px' }}>선택된 항목이 없습니다.</span>
					) : (
						[...selectedDefault, ...customTools].map(tool => (
							<span key={tool} className='selected-chip-list__item'>
								{tool}
								<button
									type="button"
									onClick={() => handleRemoveTag(tool)}
									className='btn'

								>
									<span className='d-none'>항목삭제버튼</span>
								</button>
							</span>
						))
					)}
				</div>
			</div>

			{/* 2. 기본 리스트 선택 */}
			<div className="chip-list-wrap default-tools" style={{ marginBottom: '20px' }}>
				<b className='title'>기본 항목</b>
				<div className='chip-list'>
					{DEFAULT_TOOL_LIST.map(tool => {
						const isSelected = selectedDefault.includes(tool);
						return (
							<label key={tool} className='chip-outline'>
								<input
									type="checkbox"
									hidden
									checked={isSelected}
									onChange={() => handleCheckChange(tool)}
								/>
								{tool}
							</label>
						);
					})}
				</div>
			</div>

			{/* 3. 직접 입력 (입력 후 추가 시 상단으로 이동) */}
			<div className="custom-tools-input">
				<b className='title'>기타 직접 입력</b>
				<div className='d-flex gap-1'>
					<label className="width-100per">
						<input
							className='width-100per'
							type="text"
							value={inputValue}
							placeholder="기술 이름 입력 (예: Prisma)"
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); } }}
						/>
					</label>
					<button
						type="button"
						onClick={handleAddCustom}
						className='btn dark'
						style={{ flex: 'none' }}
					>
						추가
					</button>
				</div>
			</div>
		</div>
	);
}