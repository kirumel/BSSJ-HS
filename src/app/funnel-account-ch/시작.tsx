"use client";

export default function StartRegister({ next }: { next: () => void }) {
  return (
    <div className="funnel-layout home-layout">
      <div className="register-main">
        <h2 className="start-register-title">비밀번호 찾기</h2>
        <p className="subtitle">비밀번호 찾기</p>
        <img src="altisto.png" className="start-register-img" />
        <div className="start-register-content">
          <p>비밀번호를 변경하기 위해서는 키가 필요해요!</p>
          <p>관리자에게 문의해주세요</p>
        </div>
      </div>
      <div className="ok-button-div">
        <button className="ok-button" type="button" onClick={next}>
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}
