"use client";

export default function StartRegister({ next }: { next: () => void }) {
  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            사용자님의 프로필 사진을 <br />
            설정할게요!
          </h2>
          <p className="subtitle">아래의 이메일을 작성해주세요</p>
          <input
            placeholder="닉네임"
            className="start-register-input"
            type="text"
            name="name"
          ></input>
        </div>
        <div className="ok-button-div">
          <button className="ok-button" type="button" onClick={next}>
            확인
          </button>
        </div>
      </div>
    </>
  );
}
