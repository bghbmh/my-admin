import './BoardItem.scss';

interface Props {
	item?: any;
	optionClassName?: string
}

export default function BoardItem1({ item, optionClassName }: Props) {

	console.log("aff - ", item)


	return (
		item ? (
			<div className="board-item1">
				<i className="text-icon new">새글</i>
				<span className='title'>{item.id}</span>
			</div>
		) : (
			<div className='board-item1 empty'>
				<div>알림이 없습니다 no-message</div>
			</div>
		)
	)

}