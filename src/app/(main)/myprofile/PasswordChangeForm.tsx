export default function PasswordChangeForm() {
	return (
		<div className="tab-fade-in">
			<header className="content-header">
				<h2>비밀번호 변경</h2>
				<p>보안을 위해 정기적으로 비밀번호를 변경하는 것이 좋습니다.</p>
			</header>
			<form className="profile-form">
				<div className="grid">
					<div className="item" style={{ gridColumn: "1" }}>
						<small className="label">현재 비밀번호</small>
						<label><input type="password" placeholder="현재 비밀번호를 입력하세요" /></label>
					</div>

					<div className="item" style={{ gridColumn: "1" }}>
						<small className="label">새 비밀번호</small>
						<label><input type="password" placeholder="새 비밀번호 (8자 이상, 영문/숫자 조합)" /></label>
					</div>
					<div className="item" style={{ gridColumn: "1" }}>
						<small className="label">새 비밀번호 확인</small>
						<label><input type="password" placeholder="새 비밀번호를 한 번 더 입력하세요" /></label>
					</div>

				</div>
				<div className="bottom-btn-wrap gap-2">
					<button type="submit" className="btn primary">비밀번호 업데이트</button>
				</div>
			</form>
		</div>
	);
}