"use client";
import { useState } from "react";
export default function StartRegister({ next }: { next: () => void }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleTrue = () => {
    setIsChecked(!isChecked);
  };

  const handleButtonClick = () => {
    if (isChecked) {
      next();
    }
  };
  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <video
            src="/초.mp4"
            style={{ margin: 0, marginBottom: "10px" }}
            autoPlay
            muted
            loop
            width={30}
            height={30}
          />
          <h2 className="start-register-title">이용약관 동의</h2>
          <p className="subtitle">아래의 약관을 확인해주세요</p>
          <a className="register" href="https://www.youtube.com/">
            &gt; 개인정보 처리방침
          </a>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              className="custom-checkbox"
              onChange={handleTrue}
              type="checkbox"
            />
            <p>
              위 약관을 모두 확인하였으며 <br />본 약관에 동의합니다
            </p>
          </div>
        </div>
        <div className="ok-button-div">
          <button
            className="ok-button"
            type="button"
            onClick={handleButtonClick}
            disabled={!isChecked}
          >
            다음으로
          </button>
        </div>
      </div>
    </>
  );
}
