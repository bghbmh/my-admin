"use client";

import React, { useState } from "react";
import { NO_ITEM_CONFIG } from "@/constants/config";
import { getImageUrl } from "@/utils/format";
import "./image-gallery.scss";

interface MemberCountProps {
	member: {
		url: string;
		name: string;
	}[];
}

export default function MemberCount({ member }: MemberCountProps) {

	return (
		<>
			{member && member.length > 0 ? (

				<figure key={member[0].url} className="member-count">
					<img src={getImageUrl(member[0].url)} alt={member[0].name} />
					<span className="plus-more" aria-label={`프로젝트 참가자가 ${member.length}명 더 있습니다`}><i className="icon">+</i>{member.length}</span>
				</figure>

			) : (
				<figure className="member-count no-member" title={NO_ITEM_CONFIG.EmpthMember.alt}>
					<img src={NO_ITEM_CONFIG.EmpthMember.src} alt={NO_ITEM_CONFIG.EmpthMember.alt} />
					<span className="d-none">{NO_ITEM_CONFIG.EmpthMember.alt}</span>
				</figure>
			)}
		</>
	);
}