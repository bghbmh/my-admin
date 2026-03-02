"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import '@/styles/bUploadFile.css'
import "./project-edit-view.scss";

import { ProjectDataType, DEFAULT_PROJECT_DATA } from "@/types/project.data";
import { MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
import { Descriptions, Upload, UploadFile, UploadProps } from 'antd';

import { useProjectSubmit } from "@/hooks/useProjectSubmit";

import IconText from "./icon-text";
import RadioGroupList from "./RadioGroupList";
import CheckboxGroupList from "./CheckboxGroupList";
import StateGroupList from "./state-group-list";

import MockupUploadSection from "./MockupUploadSection";
import TitleImageUploadSection from "./TitleImageUploadSection";
import ImageUploadSection from "./ImageUploadSection";
import ExternalLinkSection from "./ExternalLinkSection";
import ExtraInfoSection from "./ExtraInfoSection";
import SummarySection from "./SummarySection";
import ImageComparisonSection from "./ImageComparisonSection";

import ToolInputForm from "./ToolInputForm";

interface testProps {
	id: string;
	initialData: ProjectDataType;
	mode: "edit" | "create";
}

interface CustomTitleImageFile extends UploadFile {
	alt: string | '';
}

interface CustomMockupFile extends UploadFile {
	label: string;
}



export default function ProjectForm({ id, initialData, mode }: testProps) {
	// 1. 상태 관리(기존 this._item 역할)
	const [formData, setFormData] = useState<ProjectDataType>(initialData);
	const [titleImageFile, setTitleImage] = useState<CustomTitleImageFile[]>([]);
	const [imageFileList, setimageFileList] = useState<UploadFile[]>([]);
	const [mockupFileList, setMockupFileList] = useState<CustomMockupFile[]>([]);

	useEffect(() => {
		if (mode === "edit" && initialData) {
			setFormData(initialData);

			console.log("폼데이터 변경")
			if (initialData.titleImage) {
				setTitleImage([{
					...initialData.titleImage,
					uid: `title-image-${initialData.titleImage.url}`,
					status: 'done',
					url: initialData.titleImage.url.startsWith('http')
						? initialData.titleImage.url
						: `/uploads/${initialData.titleImage.url}`,
				}]);
			}

			if (initialData.subimage) {
				setimageFileList(initialData.subimage.map((img: any, idx: number) => ({
					...img,
					uid: `img-${idx}`,
					status: 'done',
					url: img.url.startsWith('http') ? img.url : `/uploads/${img.url}`,
				})));
			}

			if (initialData.mockup) {
				setMockupFileList(initialData.mockup.map((page: any, idx: number) => ({
					...page,
					uid: `mock-${idx}`,
					status: 'done',
					url: `/uploads/${page.url}`,
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


	//overview
	const handleSynopsisChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			overview: {
				...prev.overview,
				[name]: value
			}
		}));
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
		<form id="project-main-form" className="tCom011" onSubmit={e => handleSubmit(e, formData, mockupFileList)}>
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
					<dt>기술스택 Tools</dt>
					<dd>
						<ToolInputForm
							tools={formData.tools}
							onChange={newList => {
								setFormData(prev => {
									console.log("newList-", newList, prev.extraInfo)
									return {
										...prev,
										tools: newList
									}
								})
							}}
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
						<ExtraInfoSection
							items={formData.extraInfo}
							onChange={newList => {

								setFormData(prev => {
									console.log("newList-", newList, prev.extraInfo)
									return {
										...prev,
										extraInfo: newList
									}
								})
							}}

						/>
					</dd>
				</dl>

				<dl>
					<dt>외부링크 추가</dt>
					<dd>
						<ExternalLinkSection
							items={formData.externalLink}
							onChange={newList => setFormData(prev => ({
								...prev,
								externalLink: newList
							}))}
						/>
					</dd>
				</dl>

				<dl>
					<dt>목업 미리보기</dt>
					<dd >
						<MockupUploadSection
							fileList={mockupFileList}
							onChange={setMockupFileList} />
					</dd>
				</dl>

				<dl>
					<dt>개요</dt>
					<dd className="description">
						<b className="title">간단 설명, 한 줄 요약</b>
						<label className="width-100per">
							<textarea
								name="synopsis"
								rows={2}
								className="width-100per resize-none"
								placeholder="내용을 입력하세요"
								value={formData.overview.synopsis}
								onChange={handleSynopsisChange} />
						</label>

						<b className="title">핵심 요약</b>
						<SummarySection
							items={formData.overview.summary}
							onChange={newList => setFormData((prev) => ({
								...prev,
								overview: { ...prev.overview, summary: newList }
							}))}
						/>
					</dd>
				</dl>

				{/* ProjectForm 내부의 관련 섹션 */}
				<dl>
					<dt className="d-flex align-items-center gap-2">
						디자인 비교 (B/A)
						<label className="switch margin-left-auto" style={{ fontWeight: 'normal', fontSize: '13px', cursor: 'pointer' }}>
							<input
								type="checkbox"
								className="switch"
								checked={formData.imageComparison.use}
								onChange={(e) => setFormData(prev => ({
									...prev,
									imageComparison: {
										...prev.imageComparison,
										use: e.target.checked
									}
								}))}
							/>
						</label>
					</dt>
					<dd>
						{formData.imageComparison.use ? (
							<ImageComparisonSection
								data={formData.imageComparison}
								onChange={(newComparison) => setFormData(prev => ({
									...prev,
									imageComparison: newComparison
								}))}
							/>
						) : (
							<p className="guide-text" style={{ color: '#bfbfbf', margin: '0 0 10px 0' }}>
								디자인 전/후 비교 기능이 비활성화되어 있습니다.
							</p>
						)}
					</dd>
				</dl>

				<dl>
					<dt>추가 설명</dt>
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

			<dl className="image-wrap">
				<div>
					<dt>메인이미지</dt>

					<dd>
						<TitleImageUploadSection
							titleImage={titleImageFile}
							onChange={setTitleImage}
						/>
					</dd>
				</div>
				<div>
					<dt>메인 이미지서브 이미지 test</dt>
					<dd>
						<ImageUploadSection
							fileList={imageFileList}
							onChange={setimageFileList}
						/>
					</dd>
				</div>



				<div className="d-flex align-items-center mt-4">
					<dt className="margin-right-auto padding-0">메인노출여부</dt>
					<dd className="margin-0 d-inline-flex">
						<label className="switch">
							<span className="guide">메인노출여부</span>
							<input
								type="checkbox"
								className="switch"
								name="mainOpen"
								checked={formData.mainOpen}
								onChange={e => setFormData(prev => ({
									...prev,
									mainOpen: e.target.checked
								}))}
							/>
						</label>
					</dd>

				</div>

			</dl>

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