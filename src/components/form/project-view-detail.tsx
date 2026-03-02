"use client";

import React, { cache, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CategoryItemType, ProjectDataType, ExtraInfoItemType } from "@/types/project.data";

import { NO_ITEM_CONFIG, MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
import { Upload, UploadFile, UploadProps } from 'antd';

import { ProjectIcon, ICONSET, IconType } from "@/types/icon.data";

import ImageGallery from "@/components/image-gallery";
import "./project-edit-view.scss";

interface testProps {
	id: string,
	initialData: ProjectDataType;
	mode?: "edit" | "view" | "create";
}

export default function ProjectViewDetail({ id, initialData, mode = "view" }: testProps) {

	const currentStateInfo = STATE_STEP.find(state => state.type === initialData.currentState) || STATE_STEP[3];

	const router = useRouter();

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

	const mainCat = initialData.category.find(cat => cat.label === "main");
	const subCat = initialData.category.find(cat => cat.label === "sub");

	return (
		<>
			<div className="tCom010">
				<div className="info">
					<dl>
						<dt>현재 상황</dt>
						<dd>
							<div className={`state-${currentStateInfo.type}`}><i className={currentStateInfo.icon} aria-hidden="true"></i>{currentStateInfo.name}</div>
						</dd>
					</dl>

					<dl>
						<dt>카테고리</dt>
						<dd>
							<div className="text">{<>

								<span data-type={mainCat?.type}>{mainCat?.name}</span> / <span data-type={subCat?.type}>{subCat?.name}</span>
							</>}
							</div>
						</dd>
					</dl>
					<dl>
						<dt>기간</dt>
						<dd>{initialData.startDate === "" && initialData.endDate === "" && <div className="none details  p-0 bg-transparent justify-content-start">등록한 내용이 없습니다</div>}
						</dd>
					</dl>

					<dl>
						<dt>참여자</dt>
						<dd>
							<figure className="member no-user ">
								<figcaption><span>참여자가 없습니다</span></figcaption>
								<img src={NO_ITEM_CONFIG.member.src} alt="참여자가 없습니다" />
							</figure>
						</dd>
					</dl>

					<dl className="flex-none w-100">
						<dt>기술스택 Tools</dt>
						<dd className=" d-flex gap-2 flex-wrap ">

							{initialData.tools.length > 0 ? (initialData.tools.join(", ")) : (<div className="none details">등록한 내용이 없습니다</div>)

								// initialData.tools.map((tool, idx) => <span key={idx} className=" " >{tool}</span>)
							}
						</dd>
					</dl>

					<dl className="flex-none w-100">
						<dt>추가 정보123</dt>
						<dd className=" d-flex gap-2 flex-wrap ">
							<div className="extra-info-wrap">
								{
									initialData.extraInfo.map((info, idx) => <span key={idx} className="extra-info-item" aria-label={info.label}>{info.value}</span>)
								}

							</div>

						</dd>
					</dl>

					<dl className="flex-none w-100">
						<dt>미리보기<small>test-small 미리보기</small></dt>
						<dd>
							{/* <div className="sample-file ">
								{initialData.mockup.length > 0 ? (
									initialData.mockup.map((m, idx) => (
										<figure key={idx} className="item">
											<img src="/img/common/icon-svg-double-paper.svg" alt={m.name} />
											<figcaption>
												<span className="option title">{m.name}</span>
												<span className="option">{(m.size! / 1024).toFixed(2)} KB</span>
											</figcaption>
										</figure>
									))
								) : (
									<div className="none details">등록한 내용이 없습니다</div>
								)}

							</div> */}

							<div className="external-link-list">
								{initialData.mockup.length > 0 ? (
									initialData.mockup.map(link => (
										<a key={link.id} target="_blank" href={link.url} className="link">
											<span className="icon">
												<ICONSET type={link.type} />
											</span>
											{link.label}</a>
									))
								) : (
									<div className="none details">등록한 내용이 없습니다</div>

								)}

							</div>

						</dd>
					</dl>

					<dl>
						<dt>외부링크 추가</dt>
						<dd >
							<div className="external-link-list">
								{initialData.externalLink.length > 0 ? (
									initialData.externalLink.map(link => (
										<a key={link.id} target="_blank" href={link.url} className="link">
											<span className="icon">
												<ICONSET type={link.type} />
											</span>
											{link.label}</a>
									))
								) : (
									<div className="none details">등록한 내용이 없습니다</div>

								)}

							</div>

						</dd>
					</dl>

					<dl className=" flex-none w-100">
						<dt >간단 설명, 한 줄 요약</dt>
						<dd className="synopsis">{initialData.overview.synopsis}</dd>
					</dl>

					<dl className=" flex-none w-100">
						<dt >핵심 요약</dt>
						{initialData.overview.summary ? (initialData.overview.summary.map((s, idx) =>
							<dd key={idx} className="summary">
								{s.title === '' ? '' : (<b className="title">{s.title}</b>)}
								{s.description}
							</dd>
						)) : (
							<div className="none details">등록한 내용이 없습니다</div>
						)}
					</dl>

					<dl className="flex-none w-100">
						<dt>추가 설명</dt>
						{initialData.description === "" ? (
							<div className="none details">등록한 내용이 없습니다</div>
						) : (<dd className="description">{initialData.description}</dd>)}
					</dl>
				</div>
				<aside className="info-option">
					<dl>
						<dt>타이틀이미지</dt>
						<dd>{
							<div className="titleImage">
								{initialData.titleImage.length > 0 ? (
									<figure className="item">
										<img src={initialData.titleImage[0].url} alt={initialData.titleImage[0].name} />
										<figcaption>
											<span className="option title">{initialData.titleImage[0].name}</span>
											{initialData.titleImage[0].size !== undefined ? (<span className="option">{`${initialData.titleImage[0].size} / 1024).toFixed(2) + KB`}</span>) : ('')}
										</figcaption>
									</figure>

								) : (<div className="none details">등록한 이미지가 없습니다</div>)}
							</div>
						}</dd>
					</dl>
					<dl>
						<dt>서브이미지</dt>
						<dd><ImageGallery images={initialData.subimage} /></dd>
					</dl>


					<button type="button" className="btn">캐러셀로 보기</button>
				</aside>

				{/* 하단 버튼 */}
				<div className="bottom-btn-wrap ">
					<div className="buttons-group-row">
						<Link href="/projects" className="btn default margin-right-auto">목록</Link>
						<Link href={`/projects/${id}/edit`} className="btn dark">
							수정
						</Link>
					</div>



					<button type="button" className="btn delete mobile-elem mt-5" onClick={handleDelete}>삭제</button>

				</div >
			</div >
		</>

	);
}