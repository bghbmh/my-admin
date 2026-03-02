
import ListItem1 from "./ListItem1";

import { ProjectDataType } from "@/types/project.data";

interface Props {
	items: ProjectDataType[];
}


export default function MainListItemsSection({ items }: Props) {

	const temp = { id: "main-list-item 확인중" };
	return (
		<div className="main-list-items-wrap">
			{
				Array.from({ length: 3 }, (_, i) =>
					items[i] ? (
						<ListItem1
							key={items[i].id}
							item={items[i]}
						/>
					) : (
						<ListItem1 key={i} />
					)
				)
			}
		</div>
	)

}

