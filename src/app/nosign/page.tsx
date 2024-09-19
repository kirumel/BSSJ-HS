"use client";
import "./style.css";
import { useState } from "react";
import SignIn from "../signin/page";
import { Slide, ToastContainer, toast } from "react-toastify";
import "../choiceATteacher/style.css";

export default function Nosign() {
  const [loginmodal, setLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadingstate = (loading: boolean) => {
    setLoading(loading);
  };

  const handleloginmodal = (data: any) => {
    setLoginModal(data);
  };

  const result = (message: any) => {
    if (message) {
      toast(message);
    } else {
      null;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        closeButton={false}
      />
      <div className="nsign-background"></div>
      <p className="nsign-title">
        부산 성지고등학교
        <br />
        SJHS_HELPER
      </p>

      {loginmodal ? (
        <SignIn
          data={handleloginmodal}
          result={result}
          loadingstate={loadingstate}
        />
      ) : null}

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

      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
          </div>
        </div>
      )}
    </>
  );
}
