
import Link from "next/link";

import "./InterestedProject.scss";

import { ProjectDataType } from "@/types/project.data";
import { NO_ITEM_CONFIG } from "@/constants/config";

export default function InterestedProject({ project }: { project: ProjectDataType }) {

	const displayImage = project.titleImage.length > 0
		? project.titleImage[0]
		: project.subimage.length > 0
			? project.subimage[0]
			: null;

	const imageUrl = displayImage
		? displayImage.url
		: NO_ITEM_CONFIG.image.src;

	const imageAlt = displayImage?.alt || project.title || NO_ITEM_CONFIG.image.alt;
	const size = displayImage ? displayImage.size : 0;

	return (
		<>
			<div className="interested-project">
				<figure className="image-wrap image">
					<img src={imageUrl} alt={imageAlt} aria-hidden="true"
					/>
					{/* <figcaption>
						<span className="option">{displayImage?.name || ''}</span>
						<span className="option">2108.07KB</span>
						<span className="option">{(size / 1024).toFixed(2)}KB</span> 
					</figcaption>*/}
				</figure>
				<div className="card-contents">
					<div className="title">{project.title}</div>

					<div className="tCom006">
						project-member
					</div>

					<div className="btn-wrap">
						<Link href={`/projects/${project.id}`} className="btn2">
							상세보기
						</Link>
					</div>

				</div>
			</div>
		</>

	);
}