
import React, { useState } from 'react';
import { Upload, UploadFile } from 'antd';

interface Props {
	fileList: UploadFile[];
	onChange: (newList: UploadFile[]) => void;
}

export default function ImageUploadSection({ fileList, onChange }: Props) {

	return (
		<div className="upload-type3">
			<Upload
				multiple={true}
				listType="picture"
				fileList={fileList}
				onChange={({ fileList: tempFileList }) => onChange(tempFileList)}
				beforeUpload={() => {
					// 서버 전송을 막고 fileList 상태만 업데이트하도록 허용
					return false;
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

				<button type="button" className="upload-file-btn">
					<span className="area">파일 선택</span>
				</button>
				<div className="option-ctrl-wrap" >
					<div className="file-count">
						<span className="guide-text">선택한 파일 수 ttt</span>
						<span className="guide-count">{fileList.length}</span>개
					</div>
					<button
						type="button"
						className="btn delete-all" aria-label="전체삭제"
						onClick={(e) => {
							e.stopPropagation()
							onChange([])
						}}>전체삭제</button>
				</div>

			</Upload>
		</div>
	);
}