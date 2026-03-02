"use client";

import React, { useState } from "react";
import { getImageUrl } from "@/utils/format";

import "./image-gallery.scss";

interface ImageGalleryProps {
	images: {
		url: string;
		name: string;
		size: number;
		alt: string;
	}[];

}

export default function ImageGallery({ images }: ImageGalleryProps) {

	return (
		<>
			{images.length !== 0 ? (
				<div className="image-list">
					{images.map((img, idx) => (
						<figure key={idx} className="item">
							<img src={getImageUrl(img.url)} alt={img.alt ? img.alt : img.name} />
							<figcaption>
								<span className="option title">{img.name}</span>
								<span className="option">{(img.size! / 1024).toFixed(2)} KB</span>
							</figcaption>
							<div className="ctrl">
								<button type="button" className="btn">이미지 크게 보기</button>
							</div>
						</figure>
					))}
				</div>
			) : (
				<div className="none details" style={{ height: '178px' }}>등록한 이미지가 없습니다</div>
			)}
		</>
	);
}