import './CardType1.scss';
import { ProjectDataType } from "@/types/project.data";
import { NO_ITEM_CONFIG } from '@/constants/config';

interface Props {
	item?: ProjectDataType
	optionClassName?: string;
}

export default function CardType1({ item, optionClassName }: Props) {
	const formatDate = (timestamp: number) => {
		if (!timestamp) return "날짜 없음";
		const date = new Date(timestamp); // 숫자를 넣으면 날짜 객체 생성

		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		return `${year}.${month}.${day}`;
	};

	const imglist = item ? [...item.titleImage, ...item.subimage] : [];
	const cardImageUrl = imglist.length > 0 ? imglist[0].url : NO_ITEM_CONFIG.EmpthImg.src;

	return (
		item ? (
			<div className={`card-type1 ${optionClassName || ""}`}>
				<div className="badge-wrap">
					{/* 카테고리 정보가 있다면 표시 */}
					{item.category?.map((cat: any, idx: number) => (
						<span key={idx} className="badge" data-type={cat.type}>{cat.name}</span>
					))}
				</div>
				<small>등록일 {formatDate(item.registerDate)}</small>

				<div className="title text-truncate">
					{item.title || "제목 없음"}
				</div>



				<div className='image-wrap'>
					{/* 빈 문자열 에러 방지를 위해 null 처리 또는 기본 이미지 */}
					<img src={cardImageUrl} />
				</div>
				<a href={`/projects/${item.id}`} className='btn2'>상세보기</a>
			</div>
		) : (
			<div className='card-type1 empty'>
				<div>완료한 프로젝트가 없습니다</div>
			</div>
		)
	);
}