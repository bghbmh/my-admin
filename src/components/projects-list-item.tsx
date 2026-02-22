// "use client";

import { CategoryItemType, ProjectDataType, ExtraInfoItemType, MockupFileType } from "@/types/project.data";
import { NO_ITEM_CONFIG, MAIN_CATEGORY, SUB_CATEGORY, HASH_LIST, STATE_STEP } from "@/constants/config";
//import { useRouter } from "next/navigation";
import Link from "next/link"; // useRouter 대신 Link 임포트

import ItemImagesCount from "./item-images-count";
import MemberCount from "./member-count";

import "./projects-list-item.scss";

interface Props {
	projectData: ProjectDataType;
	isSelected: boolean;
	onSelected: (checked: boolean, id: string) => void;
}

export default function ProjectsListItem({ projectData, isSelected, onSelected }: Props) {

	//console.log("projectData in ProjectsListItem:", projectData);
	//const router = useRouter();

	const mainCategoryInfo = MAIN_CATEGORY.find(mc => mc.type === Number(projectData.category[0].type));
	const stateInfo = STATE_STEP.find(state => state.type === projectData.currentState);

	return (
		<>
			<div className="project-list-item"  >
				<label aria-label="항목선택" id="cb" className="cb">
					<input type="checkbox"
						checked={isSelected}
						onChange={e => onSelected(e.target.checked, projectData.id)} />
				</label>

				<div className="info">
					<div className={`category c-type-${mainCategoryInfo?.type}`}>
						<i className={mainCategoryInfo?.icon} aria-hidden="true"></i>
						<dl className="text">
							<dt data-type={projectData.category[0].type}>{projectData.category[0].name}</dt>
							<dd data-type={projectData.category[1].type}>{projectData.category[1].name}</dd>
						</dl>
					</div>
					<div className="title">
						<div className="text">{projectData.title}</div>
						<small>{projectData.startDate}{projectData.endDate && ` - ${projectData.endDate}`}</small>
					</div>
				</div>

				<div className="option-wrap">
					<MemberCount member={projectData.member} />
					<ItemImagesCount images={projectData.subimage} />
				</div>

				<div className={`state-${stateInfo?.type.toLowerCase() || "unknown"}`}>
					<i className={stateInfo?.icon} aria-hidden="true"></i>
					{stateInfo?.name}
				</div>

				<div className="btn-wrap">
					<Link href={`/projects/${projectData.id}`} className="btn view-btn">
						상세보기
					</Link>
					<Link href={`/projects/${projectData.id}/edit`} className="btn edit-btn">
						수정
					</Link>
					{/* <button type="button" className="btn view-btn"
						onClick={() => {
							router.push(`/projects/${projectData.projectNum}`);
						}}>상세보기</button>
					<button type="button"
						className="btn edit-btn"
						onClick={() => {
							router.push(`/projects/${projectData.projectNum}/edit`);
						}}>수정</button> */}
				</div>
			</div>
		</>
	);
}
