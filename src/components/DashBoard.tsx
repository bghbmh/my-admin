"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/client-supabase';

import { ProjectDataType } from "@/types/project.data";
import SectionHeader from "@/components/common/section-header";
import ChartProjectTypes from "@/components/chart-project-types";
import InterestedProject from "./InterestedProject";
import CategoryNavList from "./category-list";
import MainCardItemsSection from "./MainCardItemsSection";
import MainListItemsSection from "./MainListItemsSection";
import MainBoardItemsSection from "./MainBoardListSection";

import './DashBoard.scss';
import Link from "next/link";

interface UserVisualProps {
	src: string;
	alt?: string;
}

export default function DashBoard({ list }: { list: ProjectDataType[] }) {

	const completedProjects = list
		.filter(p => p.currentState === "complete")
		.sort((a, b) => b.registerDate - a.registerDate);

	const ongoingProjects = list
		.filter(p => p.currentState === "ongoing")
		.sort((a, b) => b.registerDate - a.registerDate);

	const notice: any[] = [];


	return (
		<>
			<div id="main-common-container"  >
				<section className="section main tCom001">
					<article className="item chart-container">
						<SectionHeader
							title={<h3 className="text">참여</h3>
							}
							actions={true && (
								<div className="option-wrap">
									<div className="project-count">
										<strong className="font-bebas-neue">{list.length}</strong>개
									</div>
								</div>
							)}
						/>
						<ChartProjectTypes list={list} />
					</article>

					<article className=" item">
						<SectionHeader
							title={<h3 className="text">
								관심있는
								<img className="AnimatedFE" src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png" alt="Smiling Face with Sunglasses" width="25" height="25" aria-hidden="true" />
							</h3>
							}
						/>
						<InterestedProject project={list[0]} />
					</article>

					<a className="btn create-project" href="/projects/create"><i className="icon-svg2-folder-plus" aria-hidden="true"></i><span>새 프로젝트 추가</span></a>
				</section >

				<section className="section main">
					<article className="item">
						<SectionHeader
							title={<>
								<h3 className="text">프로젝트
									<span className="font-number fcPrimary ps-2">{list.length}</span>
								</h3>
								<Link
									href="/projects"
									className="btn3 round"
									title="페이지 이동 버튼 test">
									<i className="icon-svg-chevron-right" aria-hidden="true"></i>
									<span className="d-none">페이지 이동 버튼 test</span>
								</Link>
							</>

							}
						/>

						<CategoryNavList list={list} />
					</article>


				</section>

				<section className="section main tCom007">
					<article className="complete-items">
						<SectionHeader
							title={<>
								<h3 className="text">완료
									<span className="font-number fcPrimary ps-2">{completedProjects.length}</span>
								</h3>
								<Link
									href={`/archive?state=complete`}
									className="btn3 round"
									title="페이지 이동 버튼 test">
									<i className="icon-svg-chevron-right" aria-hidden="true"></i>
									<span className="d-none">페이지 이동 버튼 test</span>
								</Link>
							</>

							}
						/>
						<MainCardItemsSection items={completedProjects.slice(0, 2)} />
					</article>

					<article className="ongoing-items">
						<SectionHeader
							title={<>
								<h3 className="text">진행중
									<span className="font-number fcPrimary ps-2">{ongoingProjects.length}</span>
								</h3>
								<Link
									href="/archive?state=ongoing"
									className="btn3 round"
									title="페이지 이동 버튼 test">
									<i className="icon-svg-chevron-right" aria-hidden="true"></i>
									<span className="d-none">페이지 이동 버튼 test</span>
								</Link>
							</>

							}
						/>
						<MainListItemsSection items={ongoingProjects.slice(0, 3)} />
					</article>

					<article className="notice">
						<SectionHeader
							title={<>
								<h3 className="text">알림
									<span className="font-number fcPrimary ps-2">0</span>
								</h3>
								<Link
									href="/projects"
									className="btn3 round"
									title="페이지 이동 버튼 test">
									<i className="icon-svg-chevron-right" aria-hidden="true"></i>
									<span className="d-none">페이지 이동 버튼 test</span>
								</Link>
							</>

							}
						/>

						<MainBoardItemsSection items={notice} />

					</article>
				</section>

			</div>



		</>

	);
}