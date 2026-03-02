export default function NotificationSettings() {
	return (
		<div className="tab-fade-in">
			<header className="content-header">
				<h2>알림 설정</h2>
				<p>받고 싶은 알림의 종류를 선택할 수 있습니다.</p>
			</header>
			<div className="notification-list">
				{[
					{ title: "이메일 알림", desc: "주요 업데이트 및 리포트를 이메일로 받습니다." },
					{ title: "브라우저 푸시", desc: "새로운 메시지나 알림이 올 때 푸시를 받습니다." },
					{ title: "마케팅 정보 수신", desc: "이벤트 및 새로운 기능 소식을 받습니다." }
				].map((item, idx) => (
					<div key={idx} className="notify-item">
						<div className="text">
							<h4>{item.title}</h4>
							<p>{item.desc}</p>
						</div>
						<label className="switch">
							<input type="checkbox" className="switch" />
						</label>
					</div>
				))}
			</div>
		</div>
	);
}