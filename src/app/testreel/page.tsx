"use client";
import { useState, useEffect } from "react";
import "./style.css";

export default function Page() {
  const [reel1, setReel1] = useState(0);
  const [reel2, setReel2] = useState(0);
  const [reel3, setReel3] = useState(0);

  const rendomindex = () => {
    for (let i = 0; i < 10000; i++) {
      setTimeout(() => {
        const newReel1 = Math.floor(Math.random() * 10);
        const newReel2 = Math.floor(Math.random() * 10);
        const newReel3 = Math.floor(Math.random() * 9);

        setReel1(newReel1);
        setReel2(newReel2);
        setReel3(newReel3);
      }, 10);
    }
  };
  const result = reel1 + reel2 + reel3;
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      rendomindex();
    }
  };
  if (result < 15 && result > 8) {
  } else if (result >= 15) {
  } else {
  }

  return (
    <div onKeyDown={handleEnter} tabIndex={0} className="flex-container">
      <h2 style={{ marginBottom: "2px" }}>롤렛</h2>
      <p className="subtitle">버튼을 1번만 눌러주세요!</p>
      <div className="reel">
        <div>{reel1}</div>
        <div>{reel2}</div>
        <div>{reel3}</div>
      </div>
      <div>
        <p>
          {reel1} + {reel2} + {reel3} = {result}
        </p>
      </div>
    </div>
  );
}
