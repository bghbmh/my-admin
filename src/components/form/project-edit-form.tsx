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


interface testProps {
	id: string,
	initialData?: any;
	mode?: "edit" | "view" | "create";
}

interface CustomMockupFile extends UploadFile {
	label?: string;
}

export default function ProjectEditForm({ id, initialData, mode = "edit" }: testProps) {
	// 1. 상태 관리(기존 this._item 역할)
	const [formData, setFormData] = useState<ProjectDataType>(initialData || {
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
		"externalLink": [],
		"projectNum": 0,
		"currentState": "",
		"startDay": "", //프로젝트 시작일
		"endDay": "", //프로젝트 종료일
		"member": [],
		"registerDay": 0,
		"modifyDay": []
	});

	const [imageFileList, setimageFileList] = useState<UploadFile[]>(initialData.subimage.map((img: any, idx: number) => ({
		uid: String(idx),
		name: img.name,
		status: 'done',
		url: `/uploads/${img.webUrl}`,
		size: img.size
	})) || []);

	const [mockupFileList, setMockupFileList] = useState<CustomMockupFile[]>(initialData.mockup.map((page: any, idx: number) => ({
		uid: String(idx),
		name: page.name,
		status: 'done',
		url: `/uploads/${page.webUrl}`,
		size: page.size,
		label: page.label || page.name,
	})) || []);

	// 2. 입력 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// 3. 제출 핸들러 (기존 _onSubmit 역할)
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// 여기서 fetch 호출 (기존 fetchHandler).  , formData
		// 
		try {

			// 1. 새로 추가된 파일들만 골라내기 (이미 서버에 있는 file.url이 없는 것들)
			const newImageFiles = imageFileList
				.filter(file => !file.url && file.originFileObj)
				.map(file => file.originFileObj as File);

			// 2. 새 파일이 있다면 서버 폴더에 먼저 업로드
			if (newImageFiles.length > 0) {
				const uploadFormData = new FormData();
				newImageFiles.forEach(file => uploadFormData.append("files", file));
				uploadFormData.append('projectId', id); // 프로젝트 ID 전달

				const imgRes = await fetch('/api/upload', {
					method: 'POST',
					body: uploadFormData, // 파일을 보낼 때는 headers를 설정하지 않습니다. (자동 설정)
				});

				if (!imgRes.ok) throw new Error("이미지 서버 저장 실패");
			}

			// 3. JSON에 저장할 이미지 정보 정리
			const updatedImages = imageFileList.map(file => {
				// 서버의 getFolderName 로직과 동일하게 적용
				const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
				const folder = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
					? 'images'
					: 'files';

				const pureUrl = file.url ? file.url.replace('/uploads/', '') : `${id}/${folder}/${file.name}`;
				return {
					alt: "",
					name: file.name,
					size: file.size,
					type: file.type || 'image/png', // 타입이 없으면 기본값
					lastModified: (file as any).lastModified || Date.now(), // 날짜 추가
					webUrl: pureUrl
				};
			});

			// 새로추가된 목업파일만 고르기
			const newMockupFiles = mockupFileList
				.filter(file => !file.url && file.originFileObj)
				.map(file => file.originFileObj as File);

			// 2. 새 파일이 있다면 서버 폴더에 먼저 업로드
			if (newMockupFiles.length > 0) {
				const uploadFormData = new FormData();
				newMockupFiles.forEach(file => uploadFormData.append("files", file));
				uploadFormData.append('projectId', id); // 프로젝트 ID 전달

				const imgRes = await fetch('/api/upload', {
					method: 'POST',
					body: uploadFormData, // 파일을 보낼 때는 headers를 설정하지 않습니다. (자동 설정)
				});

				if (!imgRes.ok) throw new Error("이미지 서버 저장 실패");
			}

			const updatedMockupList = mockupFileList.map(file => {
				return {
					label: file.label || file.name,
					alt: "",
					name: file.name,
					size: file.size,
					type: file.type || 'text/html', // 타입이 없으면 기본값
					lastModified: (file as any).lastModified || Date.now(), // 날짜 추가
					webUrl: file.url ? file.url.replace('/uploads/', '') : `${id}/files/${file.name}`
				};
			});



			// ★ formData와 합치기
			const finalData = { ...formData, subimage: updatedImages, mockup: updatedMockupList };

			console.log("제출할 데이터:", finalData);

			// 4. 프로젝트 데이터 업데이트 API 호출
			const response = await fetch('/api/projects/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(finalData),
			});

			if (response.ok) {
				alert("수정, 저장되었습니다!");
				const result = await response.json();
				console.log("저장 성공:", result);
				// 저장된 프로젝트의 상세 페이지(View)로 이동
				// 예: /projects/[id]
				router.push(`/projects/${id}`);
				router.refresh(); // 최신 데이터를 서버에서 다시 불러오도록 갱신
			}

		} catch (error) {
			console.error("저장 중 오류 발생:", error);
		}
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
		const newEntry = { currentState: item.type };
		setFormData(prev => ({
			...prev,
			currentState: newEntry.currentState
		}));
	};


	const handleExtraInfoChange = (id: number | string, name: string, value: string) => {
		setFormData(prev => ({
			...prev,
			extraInfo: prev.extraInfo.map(item =>
				item.id === id ? { ...item, [name]: value } : item
			)
		}));
	};

	const handleExtraInfoDelete = (id: number | string) => {
		setFormData(prev => ({
			...prev,
			extraInfo: prev.extraInfo.filter(item => item.id !== id)
		}));
	};

	const handleExtraInfoAdd = () => {
		const newItem = {
			id: crypto.randomUUID(),
			label: "",
			value: ""
		};
		setFormData(prev => ({
			...prev,
			extraInfo: [...prev.extraInfo, newItem]
		}));
	}




	const handleListChange = (
		listname: "externalLink" | "extraInfo",
		id: number | string,
		name: string,
		value: string
	) => {
		setFormData(prev => ({
			...prev,
			[listname]: (prev[listname] as any[]).map(item =>
				item.id === id ? { ...item, [name]: value } : item
			)
		}));
	};

	const handleListDelete = (
		listname: "externalLink" | "extraInfo",
		id: number | string
	) => {
		setFormData(prev => ({
			...prev,
			[listname]: (prev[listname] as any[]).filter(item => item.id !== id)
		}));
	};

	const handleListAdd = (listname: "externalLink" | "extraInfo", defaultType: any) => {
		const newItem = {
			id: Date.now(),
			...defaultType
		};
		setFormData(prev => ({
			...prev,
			[listname]: [...(prev[listname] as any[]), newItem]
		}));
	}

	const handleMockupLabelChange = (uid: string, name: string, value: string) => {
		setMockupFileList(prev =>
			prev.map(file => file.uid === uid ? { ...file, [name]: value } : file)
		);
	};

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (confirm("변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?")) {
			//router.back();
			router.push(`/projects/${id}`);
		}
	};

	const handleDelete = () => {
		if (confirm("정말 삭제하시겠습니까?")) {
			// 삭제 로직 실행
			console.log("삭제 로직 실행");
		}
	}


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
								value={formData.title}
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
							selectedValue={formData.currentState}
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
					<dt>추가 정보</dt>
					<dd>
						<div className="extra-info-group">
							{
								formData.extraInfo.map(item => (
									<ExtraInfoItem
										key={item.id}
										listname="extraInfo"
										id={item.id}
										label={item.label}
										value={item.value}
										onChange={handleListChange}
										onDelete={handleListDelete}
									/>
								))
							}
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
							{
								formData.externalLink.map(item => (
									<ExternalLinkItem
										key={item.id}
										listname="externalLink"
										id={item.id}
										label={item.label}
										url={item.url}
										onChange={handleListChange}
										onDelete={handleListDelete}
									/>
								))
							}
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
								value={formData.description}
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
				<button type="button"
					className="btn delete mobile-order-5"
					onClick={handleDelete}>삭제</button>
				<button type="button" onClick={handleCancel} className="btn cancel mobile-order-3">취소</button>
				<button
					type="submit"
					className="btn save">
					저장
				</button>
			</div>
		</form>
	);
}