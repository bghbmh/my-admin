"use client";

import React, { useState, useEffect } from "react";
import { Upload, UploadFile } from "antd";
import { DefaultFileType, ImageComparisonType } from "@/types/project.data";
import { UiProjectFormDataType } from "@/types/project.ui";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";

interface Props {
	data: UiProjectFormDataType['imageComparison'];
	onChange: (newData: UiProjectFormDataType['imageComparison']) => void;
}

export default function ImageComparisonSection({ data, onChange }: Props) {

	// 파일 선택 시 호출되는 핸들러
	const handleImageChange = (key: 'before' | 'after', info: { fileList: UploadFile[] }) => {
		// antd의 fileList를 그대로 부모에게 넘깁니다. (이미 배열 형태임)
		onChange({
			...data,
			[key]: info.fileList
		});
	};

	const uploadButton = (label: string) => (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{label}</div>
		</div>
	);


	return (
		<div className="comparison-upload-grid">
			{/* Before 섹션 */}
			<div className="upload-box before">
				<b className="box-label">Before</b>
				<Upload
					listType="picture-card"
					maxCount={1}
					beforeUpload={() => false} // 자동 서버 전송 방지
					fileList={data.before}
					onChange={(info) => handleImageChange('before', info)}
				>
					{/* 배열에 데이터가 있으면 버튼 숨김 */}
					{(data.before && data.before.length > 0) ? null : uploadButton("변경 전")}
				</Upload>
			</div>

			<div className="icon-center">
				<SwapOutlined />
			</div>

			{/* After 섹션 */}
			<div className="upload-box after">
				<b className="box-label">After</b>
				<Upload
					listType="picture-card"
					maxCount={1}
					beforeUpload={() => false}
					fileList={data.after || []}
					onChange={(info) => handleImageChange('after', info)}
				>
					{(data.after && data.after.length > 0) ? null : uploadButton("변경 후")}
				</Upload>
			</div>

			<style jsx>{`
                

				
            `}</style>
		</div>
	);
}