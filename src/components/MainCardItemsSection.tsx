
import CardType1 from "./CardType1";
import { ProjectDataType } from "@/types/project.data";

interface Props {
	items: ProjectDataType[];
}

export default function MainCardItemsSection({ items }: Props) {


	return (
		<div className="main-card-items-wrap">
			{
				Array.from({ length: 2 }, (_, i) =>
					items[i] ? (
						<CardType1
							key={items[i].id}
							item={items[i]}
						/>
					) : (
						<CardType1 key={i} />
					)
				)
			}
		</div>

	)

}