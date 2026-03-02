
import BoardItem1 from "./BoardItem1";

interface props {
	items: any[]
}

export default function MainBoardItemsSection({ items }: props) {

	const temp = { id: "main-board-list 확인중 message" };

	return (
		<div className="main-board-list-wrap">
			{
				items.length > 0 ? (
					items.map(msg => <BoardItem1 item={msg} />)
				) : (<BoardItem1 />)
			}
		</div>


	)

}

