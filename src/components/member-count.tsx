"use client";

import React, { useState } from "react";
import { NO_ITEM_CONFIG } from "@/constants/config";
import "./image-gallery.scss";

interface MemberCountProps {
	member: {
		webUrl: string;
		name: string;
	}[];
}

export default function MemberCount({ member }: MemberCountProps) {

	return (
		<>
			{member && member.length > 0 ? (

				<figure key={member[0].webUrl} className="member-count">
					<img src={`/uploads/${member[0].webUrl}`} alt={member[0].name} />
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