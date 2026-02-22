"use client";

import React, { cache, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CategoryItemType, ProjectDataType, ExtraInfoItemType, MockupFileType } from "@/types/project.data";

import { NO_ITEM_CONFIG, MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
import { Upload, UploadFile, UploadProps } from 'antd';

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
								<span data-type={initialData.category[0].type}>
									{initialData.category[0].name}
								</span> / <span data-type={initialData.category[1].type}>{initialData.category[1].name}</span>
							</>}
							</div>
						</dd>
					</dl>
					<dl>
						<dt>기간</dt>
						<dd>{initialData.startDate} ~ {initialData.endDate}</dd>
					</dl>

					<dl>
						<dt>참여자</dt>
						<dd>
							<figure className="member no-user ">
								<figcaption><span>참여자가 없습니다</span></figcaption>
								<img src={NO_ITEM_CONFIG.member} alt="참여자가 없습니다" />
							</figure>
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
							<div className="sample-file ">
								{
									initialData.mockup.map((m, idx) => (
										<figure key={idx} className="item">
											<img src="/img/common/icon-svg-double-paper.svg" alt={m.name} />
											<figcaption>
												<span className="option title">{m.name}</span>
												<span className="option">{(m.size! / 1024).toFixed(2)} KB</span>
											</figcaption>
										</figure>
									))
								}

							</div>

						</dd>
					</dl>

					<dl>
						<dt>외부링크 추가</dt>
						<dd >
							<div className="external-link-list">
								{
									initialData.externalLink.map(link => (
										<a key={link.id} target="_blank" href={link.url} className="link">
											<span className="icon">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg>
											</span>
											{link.label}</a>
									))
								}

							</div>

						</dd>
					</dl>

					<dl className="flex-none w-100">
						<dt>설명</dt>
						<dd className="description">{initialData.description}</dd>
					</dl>
				</div>
				<aside className="info-option">
					<ImageGallery img={initialData.subimage} />
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

				</div>
			</div>
		</>

	);
}