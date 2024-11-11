"use client";
import { useState, useEffect } from "react";
import "./style.css";

export default function Page() {
  const [reel1, setReel1] = useState(0);
  const [reel2, setReel2] = useState(0);
  const [reel3, setReel3] = useState(0);

  const rendomindex = () => {
    for (let i = 0; i < 2000; i++) {
      setTimeout(() => {
        const newReel1 = Math.floor(Math.random() * 10);
        const newReel2 = Math.floor(Math.random() * 10);
        const newReel3 = Math.floor(Math.random() * 10);

        setReel1(newReel1);
        setReel2(newReel2);
        setReel3(newReel3);
      }, 500);
    }
  };

  return (
    <div>
      <h1>동아리</h1>
      <div className="reel">
        <div>{reel1}</div>
        <div>{reel2}</div>
        <div>{reel3}</div>
      </div>
      <button onClick={rendomindex}>돌리기</button>
    </div>
  );
}
