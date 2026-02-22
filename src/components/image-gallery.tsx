"use client";

import React, { useState } from "react";

import "./image-gallery.scss";

interface ImageGalleryProps {
	img: {
		webUrl: string;
		name: string;
		size: number;
		alt: string;
	}[];

}

export default function ImageGallery({ img }: ImageGalleryProps) {

	if (!img || img.length === 0) {
		return <div>이미지가 없습니다.</div>
	}

	return (
		<div className="image-list">
			{
				img.map((img, idx) => (
					<figure key={idx} className="item">
						<img src={`/uploads/${img.webUrl}`} alt={img.alt ? img.alt : img.name} />
						<figcaption>
							<span className="option title">{img.name}</span>
							<span className="option">{(img.size! / 1024).toFixed(2)} KB</span>
						</figcaption>
						<div className="ctrl">
							<button type="button" className="btn">이미지 크게 보기</button>
						</div>
					</figure>
				))
			}


		</div>
	);
}