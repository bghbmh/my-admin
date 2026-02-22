"use client";

import Link from "next/link";
import React from "react";

// interface BrandLogoProps {
// 	info: any;
// }
// interface를 더 정확하게 정의하면 자동완성이 되어 편합니다.
interface BrandLogoProps {
	info: {
		webUrl: string;
		alt: string;
	};
}

export default function BrandLogo({ info }: BrandLogoProps) {
	return (
		<div className="logo">
			<h1>
				<Link href="/">
					<img className="logo-img" src={info.webUrl} alt={info.alt} />
				</Link>
			</h1>
		</div>
	);
}