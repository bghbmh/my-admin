"use client";

import React from "react";
import { Upload, Switch } from "antd";
import { DefaultFileType, ImageComparisonType } from "@/types/project.data";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";

interface Props {
	data: ImageComparisonType;
	onChange: (newData: ImageComparisonType) => void;
}

export default function ImageComparisonSection({ data, onChange }: Props) {

	// 개별 이미지 업데이트 핸들러
	const handleImageChange = (key: 'before' | 'after', file: any) => {
		// antd Upload에서 파일이 삭제될 때 처리
		if (!file) {
			onChange({ ...data, [key]: null });
			return;
		}

		// 새 파일 정보 객체 생성 (DefaultFileType 형식에 맞춤)
		const newFile: DefaultFileType = {
			name: file.name,
			size: file.size,
			type: file.type,
			lastModified: file.lastModified,
			alt: file.name,
			webUrl: file.webUrl || "", // 실제 업로드 로직에 따라 URL 처리 필요
		};

		onChange({ ...data, [key]: newFile });
	};

	const uploadButton = (label: string) => (
		<div className="upload-btn-inner">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{label}</div>
		</div>
	);

	return (
		<div className="image-comparison-section">
			<div className="section-ctrl">
				<span className="label">비포/애프터 비교 사용</span>
				<Switch
					checked={data.use}
					onChange={(checked) => onChange({ ...data, use: checked })}
				/>
			</div>

			{data.use && (
				<div className="comparison-upload-grid">
					{/* Before 이미지 */}
					<div className="upload-box before">
						<b className="box-label">Before (변경 전)</b>
						<Upload
							listType="picture-card"
							className="single-upload"
							showUploadList={true}
							maxCount={1}
							beforeUpload={() => false} // 자동 업로드 방지
							fileList={data.before ? [{
								uid: '-1',
								name: data.before.name,
								status: 'done',
								url: data.before.webUrl ? `/uploads/${data.before.webUrl}` : '',
							}] : []}
							onChange={({ fileList }) => handleImageChange('before', fileList[0])}
						>
							{data.before ? null : uploadButton("Before 선택")}
						</Upload>
					</div>

					<div className="icon-center">
						<SwapOutlined />
					</div>

					{/* After 이미지 */}
					<div className="upload-box after">
						<b className="box-label">After (변경 후)</b>
						<Upload
							listType="picture-card"
							className="single-upload"
							showUploadList={true}
							maxCount={1}
							beforeUpload={() => false}
							fileList={data.after ? [{
								uid: '-2',
								name: data.after.name,
								status: 'done',
								url: data.after.webUrl ? `/uploads/${data.after.webUrl}` : '',
							}] : []}
							onChange={({ fileList }) => handleImageChange('after', fileList[0])}
						>
							{data.after ? null : uploadButton("After 선택")}
						</Upload>
					</div>
				</div>
			)}

			<style jsx>{`
                .image-comparison-section {
                    padding: 20px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .section-ctrl {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .comparison-upload-grid {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    gap: 10px;
                }
                .upload-box {
                    text-align: center;
                }
                .box-label {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 13px;
                    color: #666;
                }
                .icon-center {
                    font-size: 24px;
                    color: #bfbfbf;
                    margin-top: 20px;
                }
            `}</style>
		</div>
	);
}