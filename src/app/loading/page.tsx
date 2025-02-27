"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../public/logo2.json"; // 애니메이션 JSON 파일 경로
export default function Loading() {
  const options = {
    animationData: animationData,
    autoplay: true, // 자동 재생 여부
    renderer: "svg",
  };
  return (
    <div className="loader-overlay" style={{ background: "none" }}>
      <div className="loader">
        <div className="lottie">
          <Lottie options={options} />
        </div>
      </div>
    </div>
  );
}
