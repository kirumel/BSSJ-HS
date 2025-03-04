"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../public/logo2.json"; // 애니메이션 JSON 파일 경로
export default function Loading() {
  const options = {
    animationData: animationData,
    loop: false,
    autoplay: true, // 자동 재생 여부
    renderer: "svg",
  };
  return (
    <Lottie
      options={options}
      style={{
        margin: 0,
        marginRight: "10px",
        width: "90px",
        height: "30px",
      }}
    />
  );
}
