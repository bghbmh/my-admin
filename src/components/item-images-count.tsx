"use client";

import React, { useState } from "react";
import { NO_ITEM_CONFIG } from "@/constants/config";
import "./image-gallery.scss";

interface ImagesCountProps {
	images: {
		webUrl: string;
		name: string;
		alt: string;
	}[];
}

export default function ItemImagesCount({ images }: ImagesCountProps) {

	return (
		<>
			{images && images.length > 0 ? (

				<figure key={images[0].webUrl} className="item-images-count">
					<img src={`/uploads/${images[0].webUrl}`} alt={images[0].alt || images[0].name} />
					<span className="plus-more" aria-label={`업로드된 이미지가 ${images.length}개 더 있습니다`}><i className="icon">+</i>{images.length}</span>
				</figure>

			) : (
				<figure className="item-images-count no-image" title={NO_ITEM_CONFIG.EmpthImg.alt}>
					<img src={NO_ITEM_CONFIG.EmpthImg.src} alt={NO_ITEM_CONFIG.EmpthImg.alt} />
					<span className="d-none">{NO_ITEM_CONFIG.EmpthImg.alt}</span>
				</figure>
			)}
		</>
	);
}