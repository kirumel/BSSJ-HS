"use client";
import "./ghkwkr.css";
import { useState } from "react";
export default function Home() {
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [C, setC] = useState(0);
  return (
    <div>
      <div id="nav">
        <div className="logo">작문비서</div>
      </div>
      <div id="main">
        <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
          <textarea className="text" placeholder="글을 입력해주세요"></textarea>
        </div>
        <div style={{ paddingLeft: "20px", paddingRight: "20px" }} id="footer">
          <div className="buttons">
            <button onClick={() => handleA()}>ai 작성 글 탐지</button>
            <button onClick={() => handleB()}>맞춤법 검사</button>
            <button onClick={() => handleC()}>ai 피드백</button>
          </div>
          <button className="ok">확인하기</button>
        </div>
      </div>
    </div>
  );
}
