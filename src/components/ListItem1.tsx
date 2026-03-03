import './ListItem1.scss';
import { MAIN_CATEGORY } from "@/constants/config";
import { ProjectDataType } from "@/types/project.data";

interface Props {
	item?: ProjectDataType;
	optionClassName?: string
}

export default function ListItem1({ item, optionClassName }: Props) {

	//console.log("aff - ", item)
	const mainCat = item?.category.find(cat => cat.label === "main");
	const icon = MAIN_CATEGORY.find(c => c.name === mainCat?.name)?.icon;
	return (
		item ? (
			<div className="list-item1">
				<i className={icon} aria-hidden="true"></i>
				{item.title}
			</div>
		) : (
			<div className='list-item1 empty'>
				<div>진행 중인 프로젝트가 없습니다</div>
			</div>
		)
	)

}