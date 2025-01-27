"use client";
import Link from "next/link";
import Homeschedule from "./homemeal";
import { useState } from "react";
export default function Mealcontainer() {
  const [flipped, setFlipped] = useState(false);
  console.log(flipped);
  return (
    <div className="main-container-50">
      <div className="etc-container ">
        <Link
          href="./meals"
          className="main-container-display margin-bottom-15"
        >
          <p>
            오늘의 {flipped ? "석식" : "중식"}🍚
            <p className="subtitle" style={{ fontSize: "10px" }}>
              클릭하시면 바뀝니다!
            </p>
          </p>
        </Link>
        <Homeschedule flipped={setFlipped} />
      </div>
    </div>
  );
}
