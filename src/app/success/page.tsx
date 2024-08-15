import "../funnel-register/style.css";

export default function StartRegister() {
  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            회원님의 이메일로 <br />
            인증 링크가 전송되었어요!
          </h2>
          <p className="subtitle">인증을 완료해주시면 회원가입이 완료됩니다</p>
          <div className="card-display">
            <video
              style={{ height: "130px" }}
              src="/파.mp4"
              loop
              autoPlay
              muted
            ></video>
          </div>
          <div className="ok-button-div">
            <a href="/">
              <button className="ok-button" type="button">
                홈으로 돌아가기
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
