"use client";

import React, { cache, useState } from "react";
import Link from "next/link";
import "@/styles/bUploadFile.css";
import "./project-edit-view.scss";


import { CategoryItemType, ProjectDataType, ExtraInfoItemType, MockupFileType } from "@/types/project.data";
import { MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
import { Upload, UploadFile, UploadProps } from 'antd';

import IconText from "./icon-text";
import RadioGroupList from "./RadioGroupList";
import CheckboxGroupList from "./CheckboxGroupList";
import StateGroupList from "./state-group-list";
import ExtraInfoItem from "./ExtraInfoItem";
import ExternalLinkItem from "./ExternalLinkItem";
import { stat } from "fs";
import { url } from "inspector";

import { useRouter } from "next/navigation";

interface CustomMockupFile extends UploadFile {
	label?: string;
}

export default function ProjectCreateForm() {
	// 1. 상태 관리(기존 this._item 역할)
	const [formData, setFormData] = useState<ProjectDataType>({
		id: null,
		"mainOpen": false,
		"mainOpenImages": [],
		"category": [],
		"hash": [],
		"title": "",
		"description": "",
		"extraInfo": [],
		"mainimage": [],
		"subimage": [],
		"mockup": [],
		"order": 0,
		"externalLink": [],
		"projectNum": 0,
		"currentState": "unknown",
		"startDay": "", //시작일
		"endDay": "", //종료일
		"member": []
	});

	const [imageFileList, setimageFileList] = useState<UploadFile[]>([]);

	const [mockupFileList, setMockupFileList] = useState<CustomMockupFile[]>([]);

	// 2. 입력 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// 3. 제출 핸들러 (기존 _onSubmit 역할)
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

	};



	return (
		<form className="tCom011" onSubmit={handleSubmit}>
			<div className="project-info">
				{/* 제목 입력 */}
				<dl>
					<dt>제목 <IconText title="필수" className="required" /></dt>
					<dd>
						<label className="width-100per">
							<input
								type="text"
								name="title" // formData의 키값과 일치시킴
								value=""
								onChange={handleChange}
								className="width-100per"
								placeholder="프로젝트 제목을 입력하세요"
							/>
						</label>
					</dd>
				</dl>

				<dl>
					<dt>현재 상황 <IconText title="필수" className="required" /></dt>
					<dd>
						<StateGroupList
							items={STATE_STEP}
							groupName="currentState"
							selectedValue={STATE_STEP[0].type} //초기값은 "알수없음"으로 설정
							onSelect={handleStateSelect}
						/>
					</dd>
				</dl>

				<dl>
					<dt>카테고리 <IconText title="필수" className="required" /></dt>
					<dd>
						<b className="title">업무</b>
						<RadioGroupList
							items={MAIN_CATEGORY}
							groupName="main-cat"
							selectedValue={MAIN_CATEGORY[0].name}
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
					<dt>추가 정보</dt>
					<dd>
						<div className="extra-info-group">
						</div>

						<button type="button" className="btn add-item" onClick={() => handleListAdd("extraInfo", { label: "", value: "" })}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>추가
						</button>
					</dd>
				</dl>

				<dl>
					<dt>외부링크 추가</dt>
					<dd>
						<div className="extra-info-group">
						</div>

						<button type="button" className="btn add-item" onClick={() => handleListAdd("externalLink", { label: "", url: "" })}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>추가
						</button>
					</dd>
				</dl>

				<dl>
					<dt>목업 미리보기</dt>
					<dd >
						<div className="upload-type1">
							<Upload
								listType="picture"
								fileList={mockupFileList} //화면에 그려질 "데이터
								onChange={({ fileList: newMockup }) => { //무언가 변했을 때 "새 데이터 세트"를 받아와서 원본을 교체하는 작업
									const updated = newMockup.map(file => ({
										...file,
										label: (file as CustomMockupFile).label || file.name
									}));
									setMockupFileList(updated);
								}}
								itemRender={(originNode, file: CustomMockupFile, currFileList, actions) => (

									<figure className="item">
										{/* <img
												src={file.url || file.thumbUrl || undefined}
												alt={file.name}
												style={{ display: (file.url || file.thumbUrl) ? "block" : "none" }}
											/> */}
										<img src="https://bghbmh.github.io/simple-ui-test/UploadFiles/icon-svg-double-paper.svg" alt="이미지"></img>
										<figcaption>
											<label>
												<span className="guide">라벨</span>
												<input
													name="label"
													type="text"
													value={file.label}
													placeholder="라벨을 입력하세요"
													onChange={e => handleMockupLabelChange(file.uid, e.target.name, e.target.value)} />
											</label>
											<span className="option title">{file.name}</span>
											<span className="option">{(file.size! / 1024).toFixed(2)} KB</span>
										</figcaption>
										<div className="ctrl">
											<button type="button" className="btn delete-one" aria-label="삭제" onClick={() => actions.remove()}></button>
										</div>
									</figure>

								)}
							>
								<button type="button" className="upload-file-btn">
									<span className="area">
										미리보기 할 목업 파일을 여기에 끌어다 놓거나,<br />
										파일 선택 버튼으로 직접 선택해주세요.
										<span className="btn primary">파일 선택 (다중)</span>
									</span>
								</button>
								<div className="option-ctrl-wrap" >
									{mockupFileList.length > 0 && (<>
										<div className="file-count">
											<span className="guide-text">선택한 파일 수</span>
											<span className="guide-count">{mockupFileList.length}</span>개
										</div>
										<button
											type="button"
											className="btn delete-all" aria-label="전체삭제"
											onClick={(e) => {
												e.stopPropagation();
												setMockupFileList([]);
											}}>전체삭제</button>
									</>)}
								</div>

							</Upload>
						</div>
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
								value={''}
								onChange={handleChange} />
						</label>
					</dd>
				</dl>

			</div>

			{/* 이미지 업로드 영역 (분리된 컴포넌트) */}
			<div className="image-wrap">
				서브 이미지
				<div className="upload-type3">
					<Upload
						listType="picture"
						fileList={imageFileList}
						onChange={({ fileList: newImageFileList }) => setimageFileList(newImageFileList)}
						itemRender={(originNode, file, currFileList, actions) => (
							<figure className="item">
								<img
									src={file.url || file.thumbUrl || undefined}
									alt={file.name}
									style={{ display: (file.url || file.thumbUrl) ? "block" : "none" }}
								/>
								<figcaption>
									<span className="option title">{file.name}</span>
									<span className="option">{(file.size! / 1024).toFixed(2)} KB</span>
								</figcaption>
								<div className="ctrl">
									<button type="button" className="btn delete-one" aria-label="삭제" onClick={() => actions.remove()}></button>
								</div>
							</figure>

						)}
					>

						<button type="button" className="upload-file-btn">
							<span className="area">파일 선택</span>
						</button>
						<div className="option-ctrl-wrap" >
							<div className="file-count">
								<span className="guide-text">선택한 파일 수 ttt</span>
								<span className="guide-count">{imageFileList.length}</span>개
							</div>
							<button
								type="button"
								className="btn delete-all" aria-label="전체삭제"
								onClick={(e) => {
									e.stopPropagation()
									setimageFileList([])
								}}>전체삭제</button>
						</div>

					</Upload>
				</div>

			</div>

			{/* 하단 버튼 */}
			<div className="bottom-btn-wrap ">
				<Link href="/projects" className="btn list margin-right-auto mobile-order-4">목록</Link>
				<button type="button" onClick={handleCancel} className="btn cancel mobile-order-3">취소</button>
				<button
					type="submit"
					className="btn save">
					등록
				</button>
			</div>
		</form>
	);
}