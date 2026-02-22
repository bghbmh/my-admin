"use client";

import "./user-image.scss";

interface UserVisualProps {
	src: string;
	alt?: string;
}

export default function UserVisual({ src, alt = "사용자 이미지" }: UserVisualProps) {
	return (
		<div className="user-image-wrap" aria-hidden="true">
			{/* 1. 디자인에 필요한 SVG Defs (내부에 포함시켜 캡슐화) */}
			<svg className="visual-defs" width="0" height="0">
				<defs>
					<path id="gShape" d="M17.5446 94.2634C92.199 53.7388 136.89 -28.0779 175.525 10.7355C214.16 49.5489 158.125 209.96 107.447 208.018C46.1097 205.668 -36.4023 123.547 17.5446 94.2634Z" />
					<clipPath id="userImageClip">
						<path d="M2.3381 2.38196C38.992 2.38198 23.0594 2.3816 79.785 2.38145C136.511 2.3813 215.147 -23.6452 184.094 102.616C170.949 156.061 139.266 211.159 109.439 210.016C63.9646 208.274 6.85215 162.687 2.33518 127.29C-0.81356 102.616 2.33818 43.8108 2.3381 2.38196Z" />
					</clipPath>
				</defs>
			</svg>

			{/* 2. 실제 이미지와 배경 SVG 레이어 */}
			<div className="image-container">
				<img className="user-img" src={src} alt={alt} />
				<svg className="shape-bg primary"><use href="#gShape" /></svg>
				<svg className="shape-bg secondary"><use href="#gShape" /></svg>
			</div>
		</div>
	);
}