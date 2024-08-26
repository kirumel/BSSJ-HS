"use client";
import "./style.css";
import { useState } from "react";
import SignIn from "../signin/page";
export default function nosign() {
  const [loginmodal, setLoginModal] = useState(false);
  const handleloginmodal = (data: any) => {
    setLoginModal(data);
  };

  return (
    <>
      <div className="nsign-background"></div>
      <p className="nsign-title">
        부산 성지고등학교
        <br />
        SJHS_HELPER
      </p>

      {loginmodal ? <SignIn data={handleloginmodal} /> : null}
      <div className="nsign-position">
        <div className="nsign-login-box">
          <button
            className="nsign-login"
            onClick={() => handleloginmodal(true)}
          >
            BSSJ로그인
          </button>
          <a href="/funnel-register">
            <button className="nsign-register">회원가입하기</button>
          </a>
        </div>
      </div>
    </>
  );
}
