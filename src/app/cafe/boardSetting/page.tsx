"use client";
import MakeBoard from "../makeBoards/page";

import { useState } from "react";
export default function Page() {
  const [make, setmake] = useState(false);
  console.log(make);

  function makeBoard() {
    setmake(!make);
  }

  return (
    <div>
      <div>게시판 관리</div>
      <button onClick={() => makeBoard()}>게시판 만들기</button>
      {make && <MakeBoard />}
    </div>
  );
}
