
import React from 'react';
import { Upload, UploadFile } from 'antd';

interface Props {
	titleImage: UploadFile[];
	onChange: (newImage: UploadFile[]) => void;
}

export default function TitleImageUploadSection({ titleImage, onChange }: Props) {

	return (
		<div className="upload-type2">
			<Upload
				listType="picture"
				fileList={titleImage}
				maxCount={1} // 단일 파일로 제한
				onChange={({ fileList: newImage }) => {
					const updated = newImage.map(file => ({
						...file,
						alt: file.name
					}));
					onChange(updated);
				}}
				itemRender={(originNode, file, currFileList, actions) => {

					return (
						<figure className="item">
							<img
								src={file.url || file.thumbUrl || undefined}
								alt={file.name}
								style={{ display: (file.url || file.thumbUrl) ? "block" : "none" }}
							/>
							<figcaption>
								<span className="option title">{file.name}</span>
								<span className="option">{(file.size! / 1024).toFixed(2)} KB</span>
							</figcaption>
							<div className="ctrl">
								<button type="button" className="btn delete-one" aria-label="삭제" onClick={() => actions.remove()}></button>
							</div>
						</figure>
					)
				}}
			>
				{/* 이미지가 없을 때만 버튼 표시 */}
				{titleImage.length < 1 && (
					<button type="button" className="upload-file-btn">
						<span className="area">파일 선택메인 타이틀 이미지 선택</span>
					</button>
				)}


			</Upload>
		</div>
	);
}