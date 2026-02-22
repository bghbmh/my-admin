"use client";

import React, { useState } from "react";
import Link from "next/link";

import "./project-form.scss";

import IconText from "./icon-text";
import RadioGroupList from "./RadioGroupList";
import CheckboxGroupList from "./CheckboxGroupList";
import StateGroupList from "./state-group-list";

import { MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";

interface testProps {
	id: string,
	initialData?: any;
	mode?: "edit" | "view" | "create";
}

interface CategoryItem {
	name: string;
	type: string;
	label: "main" | "sub";
}

interface ProjectDataType {
	id: number | null;
	mainOpen: boolean;
	mainOpenImages: string[];
	category: CategoryItem[];
	hash: string[];
	title: string;
	description: string;
	extraInfo: Record<string, any>;
	mainimage: any[];
	subimage: any[];
	sampleName: string;
	samplePage: any[];
	order: number;
	externalLink: Record<string, any>;
	projectNum: number;
	projectState: string;
	member: string[];
}

export default function ProjectForm({ id, initialData, mode = "edit" }: testProps) {
	// 1. 상태 관리(기존 this._item 역할)
	const [formData, setFormData] = useState<ProjectDataType>(initialData || {
		id: null,
		"mainOpen": false,
		"mainOpenImages": [],
		"category": [],
		"hash": ["디자인",
			"마크업",
			"반응형",
			"브랜딩"],
		"title": "",
		"description": "",
		"extraInfo": {},
		"mainimage": [],
		"subimage": [],
		"sampleName": "",
		"samplePage": [],
		"order": 0,
		"externalLink": {},
		"projectNum": 0,
		"projectState": "unknown",
		"member": []
	});

	// 2. 입력 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// 3. 제출 핸들러 (기존 _onSubmit 역할)
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("제출할 데이터:");
		// 여기서 fetch 호출 (기존 fetchHandler).  , formData
	};

	// 2. 카테고리 전용 핸들러 (label을 직접 인자로 받음)
	const handleCatSelect = (item: any, label: "main" | "sub") => {
		const newEntry = { name: item.name, type: String(item.type), label };
		setFormData(prev => ({
			...prev,
			category: [...prev.category.filter(c => c.label !== label), newEntry]
		}));
	};

	//검색키워드 핸들러
	const handleHashSelect = (isChecked: boolean, hash: string) => {
		setFormData(prev => ({
			...prev,
			hash: isChecked
				? [...prev.hash, hash]
				: prev.hash.filter(prevHash => prevHash !== hash)
		}))
	};

	const handleStateSelect = (item: any) => {
		const newEntry = { projectState: item.type };
		setFormData(prev => ({
			...prev,
			projectState: newEntry.projectState
		}));
	};

	return (
		<form className="tCom011" onSubmit={handleSubmit}>
			<div className="project-info">
				{/* 제목 입력 */}
				test============
				<dl>
					<dt>제목 <IconText title="필수" className="required" /></dt>
					<dd>
						<label className="width-100per">
							<input
								type="text"
								name="title" // formData의 키값과 일치시킴
								value={formData.title}
								onChange={handleChange}
								className="width-100per"
								placeholder="프로젝트 제목을 입력하세요"
							/>
						</label>
					</dd>
				</dl>

				<dl>
					<dt>카테고리 <IconText title="필수" className="required" /></dt>
					<dd>
						<b className="title">업무</b>
						<RadioGroupList
							items={MAIN_CATEGORY}
							groupName="main-cat"
							selectedValue={formData.category.find(c => c.label === "main")?.name}
							onSelect={(item) => handleCatSelect(item, "main")}
						/>
					</dd>
					<dd>
						<b className="title">작업</b>
						<RadioGroupList
							items={SUB_CATEGORY}
							groupName="sub-cat"
							selectedValue={formData.category.find(c => c.label === "sub")?.name}
							onSelect={(item) => handleCatSelect(item, "sub")}
						/>
					</dd>
				</dl>

				<dl>
					<dt>검색 키워드</dt>
					<dd>
						<CheckboxGroupList
							items={HASH_LIST}
							groupName="hash"
							selectedValue={formData.hash}
							onSelect={handleHashSelect}
						/>
					</dd>
				</dl>

				<dl>
					<dt>참여자</dt>
					<dd>
						<div className="project-group">
							{
								formData.member.map(mem => (

									<div className="project-group__member" key={mem}>
										<label aria-label="참여자"><input name="member" type="checkbox" checked onChange={() => console.log("test")} /></label>
										<figure className="member info">
											<figcaption><span>{mem}</span></figcaption>
											<img src="/img/common/icon-svg-no-user.svg" alt="참여자사진" />
										</figure>
									</div>

								))
							}

							<div className="project-group__member" >
								<label aria-label="참여자"><input name="member" type="checkbox" checked onChange={() => console.log("test")} /></label>
								<figure className="member info">
									<figcaption><span>참여자</span></figcaption>
									<img src="/img/common/icon-svg-no-user.svg" alt="참여자사진" />
								</figure>
							</div>

							<div className="project-group__member" >
								<label aria-label="참여자"><input name="member" type="checkbox" checked onChange={() => console.log("test")} /></label>
								<figure className="member info">
									<figcaption><span>참여자이름이 긴 경우</span></figcaption>
									<img src="/img/common/icon-svg-no-user.svg" alt="참여자사진" />
								</figure>
							</div>
						</div>

						<button type="button" className="btn add-item">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>추가
						</button>
					</dd>
				</dl>

				<dl>
					<dt>추가 정보</dt>
					<dd>
						<div className="extra-info-group">
							<div className="extra-info-group__item">
								<label className="info-label">
									<span className="guide">라벨</span>
									<input type="text" name="label" value="디자인" placeholder="라벨" onChange={() => console.log("test")} />
								</label>
								<label className="info-value">
									<span className="guide">내용</span>
									<input type="text" name="value" value="박민희" placeholder="내용" onChange={() => console.log("test")} />
								</label>
								<button type="button" className="btn delete-one" data-action="delete">삭제</button>
							</div>
							<div className="extra-info-group__item">
								<label className="info-label">
									<span className="guide">라벨</span>
									<input type="text" name="label" value="디자인" placeholder="라벨" onChange={() => console.log("test")} />
								</label>
								<label className="info-value">
									<span className="guide">내용</span>
									<input type="text" name="value" value="박민희" placeholder="내용" onChange={() => console.log("test")} />
								</label>
								<button type="button" className="btn delete-one" data-action="delete">삭제</button>
							</div>
						</div>

						<button type="button" className="btn add-item">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>추가
						</button>
					</dd>
				</dl>


				<dl>
					<dt>현재 상황 <IconText title="필수" className="required" /></dt>
					<dd>
						<StateGroupList
							items={STATE_STEP}
							groupName="projectState"
							selectedValue={formData.projectState}
							onSelect={handleStateSelect}
						/>
					</dd>
				</dl>

				<dl>
					<dt>설명</dt>
					<dd className="description">
						<label className="width-100per">
							<textarea
								name="description"
								rows={6}
								className="width-100per resize-none"
								placeholder="내용을 입력하세요"
								value={formData.description} />
						</label>
					</dd>
				</dl>

			</div>

			{/* 이미지 업로드 영역 (분리된 컴포넌트) */}
			<div className="image-wrap">
				메인 이미지
			</div>

			{/* 하단 버튼 */}
			<div className="bottom-btn-wrap ">
				<Link href="/projects" className="btn default">목록</Link>
				<button type="button" onClick={() => history.back()} className="btn default margin-right-auto">취소</button>
				<button type="submit" className="btn primary">저장</button>
			</div>
		</form>
	);
}