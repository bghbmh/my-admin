"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { projectService } from "@/services/projectService";

import { ProjectDataType, DEFAULT_PROJECT_DATA } from "@/types/project.data";
import { MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
import { EMPTY_UI_DATA, UiProjectFormDataType, transformToUiFileList } from "@/types/project.ui";

import { useProjectSubmit } from "@/hooks/useProjectSubmit";

import IconText from "./icon-text";
import RadioGroupList from "./RadioGroupList";
import CheckboxGroupList from "./CheckboxGroupList";
import StateGroupList from "./state-group-list";

import TitleImageUploadSection from "./TitleImageUploadSection";
import ImageUploadSection from "./ImageUploadSection";
import ExternalLinkSection from "./ExternalLinkSection";
import ExtraInfoSection from "./ExtraInfoSection";
import SummarySection from "./SummarySection";
import ImageComparisonSection from "./ImageComparisonSection";

import ToolInputForm from "./ToolInputForm";
import '@/styles/bUploadFile.css'
import "./project-edit-view.scss";
interface testProps {
	id: string;
	initialData: ProjectDataType;
	mode: "edit" | "create";
}

export default function ProjectForm({ id, initialData, mode }: testProps) {

	// 1. 상태 관리 통합 (초기값은 빈 구조로 설정하여 에러 방지)
	const [formData, setFormData] = useState<UiProjectFormDataType>(EMPTY_UI_DATA);

	useEffect(() => {
		if (initialData && mode === "edit") {
			const uiData: UiProjectFormDataType = {
				...initialData,
				imageComparison: {
					use: initialData.imageComparison.use,
					before: transformToUiFileList(initialData.imageComparison.before, 'before'),
					after: transformToUiFileList(initialData.imageComparison.after, 'after'),
				},
				titleImage: transformToUiFileList(initialData.titleImage, 'titleimage'),
				subimage: transformToUiFileList(initialData.subimage, 'subimage')
			};
			setFormData(uiData);
		}
	}, [initialData]);

	// 데이터 로딩 중 예외 처리
	if (!formData) return <div className="loading">데이터를 불러오는 중입니다...</div>;

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

	const { handleSubmit: originalSubmit } = useProjectSubmit(mode, id);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, data: any) => {
		e.preventDefault();

		// 💡 데모 모드 체크 (Vercel 환경일 때)
		// 브라우저 주소창에 'vercel'이 포함되어 있으면 저장을 막습니다.
		if (typeof window !== 'undefined' && window.location.hostname.includes('vercel')) {
			alert("현재 페이지는 포트폴리오 데모 모드입니다. \n데이터 저장 및 삭제 기능은 작동하지 않습니다. 😊");
			return;
		}

		// 로컬 환경(localhost)일 때만 실제 저장이 실행됨
		originalSubmit(e, data);
	};

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

	const handleDelete = async () => {
		if (confirm("정말 삭제하시겠습니까?")) {
			try {
				// 1. 삭제 서비스 호출
				await projectService.deleteProjects([id]); // 단일 삭제라도 배열로 감싸서 호출

				// 2. 성공 알림 (이 부분이 확실히 실행됩니다)
				alert("프로젝트가 성공적으로 삭제되었습니다. ✨");

				// 3. 페이지 이동 및 데이터 갱신
				router.push("/projects");
				router.refresh();

			} catch (error: any) {
				let finalMessage = "삭제 중 오류가 발생했습니다.";

				try {
					// JSON 형태의 커스텀 에러인지 확인
					const errorData = JSON.parse(error.message);
					if (errorData.user === "guest") {
						finalMessage = `🚫 [권한 제한] ${errorData.msg}`;
					} else {
						finalMessage = errorData.msg;
					}
				} catch (e) {
					// 일반 텍스트 에러일 경우
					finalMessage = error.message || finalMessage;
				}

				alert(finalMessage); // 🎯 실패 시에도 여기서 얼랏이 뜹니다.
			}
		}
	};

	return (
		<form id="project-main-form" className="tCom011"
			onSubmit={e => handleSubmit(e, formData)}>
			<div className="project-info">
				{/* 제목 */}
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

				{/* 기술스택 Tools */}
				<dl>
					<dt>기술스택 Tools</dt>
					<dd>
						<ToolInputForm
							tools={formData.tools}
							onChange={arr => {
								setFormData(prev => {
									console.log("newList-", arr)
									return {
										...prev,
										tools: arr
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

				{/* 1. 기존 외부링크 섹션 아래 혹은 목업 섹션 위에 추가 */}
				<dl>
					<dt>아이프레임 미리보기 (Mockup)</dt>
					<dd>
						<p className="guide-text" style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
							* 깃허브 페이지 주소(https://...)를 입력하면 상세페이지에서 아이프레임으로 출력됩니다.
						</p>
						<ExternalLinkSection
							items={formData.mockup} // 기존 mockup 리스트 활용
							onChange={newList => setFormData(prev => ({
								...prev,
								mockup: newList
							}))}
						/>
					</dd>
				</dl>

				{/* 목업 미리보기 - 이제 formData에서 직접 관리 */}
				<dl>
					<dt>문서</dt>
					<dd>
						{/* <MockupUploadSection
							fileList={formData.normalfile}
							onChange={newList => setFormData(prev => ({
								...prev,
								mockup: newList
							}))}
						/> */}
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

				{/* 디자인 비교 (B/A) */}
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

			{/* 이미지 업로드 영역 - 상태 통합 완료 */}
			<dl className="image-wrap">
				<div>
					<dt>메인이미지</dt>
					<dd>
						<TitleImageUploadSection
							titleImage={formData.titleImage}
							onChange={(newFiles) => setFormData(prev => ({ ...prev, titleImage: newFiles }))}
						/>
					</dd>
				</div>
				<div>
					<dt>서브 이미지</dt>
					<dd>
						<ImageUploadSection
							fileList={formData.subimage}
							onChange={(newFiles) => setFormData(prev => ({ ...prev, subimage: newFiles }))}
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