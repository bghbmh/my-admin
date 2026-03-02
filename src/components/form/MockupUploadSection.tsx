
import React from 'react';
import { Upload, UploadFile } from 'antd';

interface Props {
	fileList: UploadFile[];
	onChange: (newList: UploadFile[]) => void;
}

export default function MockupUploadSection({ fileList, onChange }: Props) {

	// 목업 파일 라벨 변경 핸들러
	// 메뉴명처럼 사용할 라벨 추가함, 라벨 입력값이 없는 경우 파일명으로 대체
	const handleLabelChange = (uid: string, value: string) => {
		const updated = fileList.map(file =>
			file.uid === uid ? { ...file, label: value } : file
		);
		onChange(updated);
	};


	return (
		<div className="upload-type1">
			<Upload
				multiple={true}
				listType="picture"
				fileList={fileList} //화면에 그려질 "데이터
				onChange={({ fileList: newMockup }) => { //무언가 변했을 때 "새 데이터 세트"를 받아와서 원본을 교체하는 작업
					const updated = newMockup.map(file => ({
						...file,
						label: (file as UploadFile).label || file.name
					}));
					onChange(updated);
				}}
				itemRender={(
					originNode: React.ReactElement,
					file: UiMockupFile | UploadFile,
					currFileList: object[],
					actions: { remove: Function }
				) => (
					<figure className="item">
						<img src="https://bghbmh.github.io/simple-ui-test/UploadFiles/icon-svg-double-paper.svg" alt="이미지"></img>
						<figcaption>
							<label>
								<span className="guide">라벨</span>
								<input
									name="label"
									type="text"
									value={(file as UiMockupFile).label || ""}
									placeholder="라벨을 입력하세요"
									onChange={e => handleLabelChange(file.uid, e.target.value)} />
							</label>
							<span className="option title">{file.name}</span>
							<span className="option">{(file.size! / 1024).toFixed(2)} KB</span>
						</figcaption>
						<div className="ctrl">
							<button type="button" className="btn delete-one" aria-label="삭제" onClick={() => actions.remove()}></button>
						</div>
					</figure>

				)}
			>
				<button type="button" className="upload-file-btn">
					<span className="area">
						미리보기 할 목업 파일을 여기에 끌어다 놓거나,<br />
						파일 선택 버튼으로 직접 선택해주세요.
						<span className="btn primary">파일 선택 (다중)</span>
					</span>
				</button>
				<div className="option-ctrl-wrap" >
					{fileList.length > 0 && (<>
						<div className="file-count">
							<span className="guide-text">선택한 파일 수</span>
							<span className="guide-count">{fileList.length}</span>개
						</div>
						<button
							type="button"
							className="btn delete-all" aria-label="전체삭제"
							onClick={(e) => {
								e.stopPropagation();
								onChange([]);
							}}>전체삭제</button>
					</>)}
				</div>

			</Upload>
		</div>
	);
}