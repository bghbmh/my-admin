"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/bUploadFile.css";
import "./project-edit-view.scss";

import { CategoryItemType, ProjectDataType, ExtraInfoItemType, MockupFileType } from "@/types/project.data";
import { MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
import { Upload, UploadFile, UploadProps } from 'antd';

import { useProjectSubmit } from "@/hooks/useProjectSubmit";

import IconText from "./icon-text";
import RadioGroupList from "./RadioGroupList";
import CheckboxGroupList from "./CheckboxGroupList";
import StateGroupList from "./state-group-list";
import ExtraInfoItem from "./ExtraInfoItem";
import ExternalLinkItem from "./ExternalLinkItem";

interface testProps {
	id: string;
	initialData: ProjectDataType;
	mode: "edit" | "create";
}

interface CustomMockupFile extends UploadFile {
	label: string;
}

export default function ProjectForm({ id, initialData, mode }: testProps) {
	// 1. 상태 관리(기존 this._item 역할)
	const [formData, setFormData] = useState<ProjectDataType>(initialData);
	const [imageFileList, setimageFileList] = useState<UploadFile[]>([]);
	const [mockupFileList, setMockupFileList] = useState<CustomMockupFile[]>([]);

	useEffect(() => {
		if (mode === "edit" && initialData) {
			if (initialData.subimage) {
				setimageFileList(initialData.subimage.map((img: any, idx: number) => ({
					uid: `img-${idx}`,
					status: 'done',
					name: img.name,
					size: img.size,
					type: img.type,
					lastModified: img.lastModified,
					url: `/uploads/${img.webUrl}`,
					alt: img.name

				})));
			}

			if (initialData.mockup) {
				setMockupFileList(initialData.mockup.map((page: any, idx: number) => ({
					uid: `mock-${idx}`,
					status: 'done',
					name: page.name,
					size: page.size,
					type: page.type || 'text/html', // 타입이 없으면 기본값
					lastModified: page.lastModified,
					url: `/uploads/${page.webUrl}`,
					alt: page.alt || page.name,
					label: page.label || page.name,
				})));
			}
		}
	}, [initialData, mode]);


	// 입력 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// 현재 상태 선택 핸들러
	const handleStateSelect = (item: any) => {
		const newEntry = { currentState: item.type };
		setFormData(prev => ({
			...prev,
			currentState: newEntry.currentState
		}));
	};

	// 카테고리 선택 핸들러
	const handleCatSelect = (item: any, label: "main" | "sub") => {
		const newEntry = { type: String(item.type), name: item.name, label };
		setFormData(prev => {
			// 기존 카테고리에서 같은 label을 가진 항목은 제거하고, 새 항목을 추가
			const filteredCategory = prev.category.filter(c => c.label !== label);
			return {
				...prev,
				category: [...filteredCategory, newEntry]
			};
		});
	};

	// 해시 선택 핸들러
	const handleHashSelect = (isChecked: boolean, h: string) => {
		setFormData(prev => ({
			...prev,
			hash: isChecked
				? [...prev.hash, h]
				: prev.hash.filter(hash => hash !== h)
		}));
	};

	// 추가항목 핸들러
	const handleListChange = (listname: "extraInfo" | "externalLink", id: string, name: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[listname]: prev[listname].map((item: any) => item.id === id ? { ...item, [name]: value } : item)
		}));
	};

	// 추가항목 핸들러
	const handleListDelete = (listname: "extraInfo" | "externalLink", id: string) => {
		setFormData(prev => ({
			...prev,
			[listname]: prev[listname].filter((item: any) => item.id !== id)
		}));
	};

	// 추가항목 핸들러
	const handleListAdd = (listname: "extraInfo" | "externalLink", defaultValue: any) => {
		const newItem = { ...defaultValue, id: crypto.randomUUID() };
		setFormData(prev => ({
			...prev,
			[listname]: [...prev[listname], newItem]
		}));
	};

	// 목업 파일 라벨 변경 핸들러
	const handleMockupLabelChange = (uid: string, name: string, value: string) => {
		setMockupFileList(prev =>
			prev.map(file => file.uid === uid ? { ...file, [name]: value } : file)
		);
	};


	// 프로젝트 데이터 폼 핸들러
	const router = useRouter();

	// 2. 훅 호출 (반드시 여기, 최상단에서!)
	console.log("useProjectSubmit 호출 - mode:", mode, "id:", id);
	const { handleSubmit } = useProjectSubmit(mode, id);
	// const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	// 	handleSubmit(e, formData, imageFileList, mockupFileList);
	// };

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (confirm("변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?")) {
			//router.back(); Next.js 13에서는 useRouter의 back() 메서드가 제거되었으므로, 대신 window.history.back()을 사용합니다.
			// window.history.back();
			//router.push("/projects"); //목록으로 이동하는 방식도 고려할 수 있습니다.

			router.back();
			console.log("취소"); //디버깅용 로그
		}
	};

	const handleDelete = () => {
		if (confirm("정말 삭제하시겠습니까?")) {

			// 1. 서버에 삭제 요청 보내기 (예시 URL, 실제 API 엔드포인트로 변경 필요)
			fetch(`/api/projects/delete`, {
				method: "DELETE",
				body: JSON.stringify({ id }),
			}).then((response) => {
				if (response.ok) {
					alert("프로젝트가 삭제되었습니다.");
					router.push("/projects"); // 삭제 후 목록 페이지로 이동
				} else {
					alert("삭제에 실패했습니다. 다시 시도해주세요.");
				}
			}).catch((error) => {
				console.error("삭제 중 오류 발생:", error);
				alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
			});
		}
	};

	return (
		<form id="project-main-form" className="tCom011" onSubmit={e => handleSubmit(e, formData, imageFileList, mockupFileList)}>
			<div className="project-info">
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
							selectedValue={formData.currentState} //초기값은 "알수없음"으로 설정
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
							selectedValue={formData.category.find(c => c.label === "main")?.name} //초기값은 "알수없음"으로 설정
							onSelect={(item) => handleCatSelect(item, "main")}
						/>
					</dd>
					<dd>
						<b className="title">작업</b>
						<RadioGroupList
							items={SUB_CATEGORY}
							groupName="sub-cat"
							selectedValue={formData.category.find(c => c.label === "sub")?.name} //초기값은 "알수없음"으로 설정
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
								itemRender={(
									originNode: React.ReactElement,
									file: CustomMockupFile | UploadFile,
									currFileList: object[],
									actions: { remove: Function }
								) => (
									<figure className="item">
										<img src="https://bghbmh.github.io/simple-ui-test/UploadFiles/icon-svg-double-paper.svg" alt="이미지"></img>
										<figcaption>
											<label>
												<span className="guide">라벨</span>
												<input
													name="label"
													type="text"
													value={(file as CustomMockupFile).label || ""}
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

			<div className="image-wrap">
				메인 이미지서브 이미지 test
				<div className="bg-info">hh</div>
				<div className="upload-type3">
					<Upload
						listType="picture"
						fileList={imageFileList}
						onChange={({ fileList: newImageFileList }) => setimageFileList(newImageFileList)}
						itemRender={(originNode: React.ReactElement,
							file: CustomMockupFile | UploadFile,
							currFileList: object[],
							actions: { remove: Function }) => {

							return (

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

							)
						}}
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
			<div className="bottom-btn-wrap justify-content-between gap-2">

				{/* 목록: 좌측 끝 */}
				<Link href="/projects" className="btn default">목록</Link>

				{/* 중간 여백을 채워 삭제/취소/저장을 우측으로 밀기 */}
				<div className="buttons-group">

					<button type="button" onClick={handleCancel} className="btn cancel">취소</button>
					<button type="submit" className="btn primary">
						{mode === "edit" ? "저장" : "등록"}
					</button>
				</div>

				{mode !== "create" && (
					<button type="button" className="btn delete mobile-elem mobile-order-5" onClick={handleDelete}>삭제</button>
				)}

			</div>
		</form>
	);
}