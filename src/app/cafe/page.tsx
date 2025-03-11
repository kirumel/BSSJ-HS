"use client";
import "./cafe.css";
import Cafe from "./cafe";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Board from "./boards";
import { useState } from "react";
export default function Page() {
  const { data: session } = useSession();
  const [boardState, setBoardState] = useState("");
  const handleBoardSelect = (boardId: string) => {
    setBoardState(boardId);
  };
  return (
    <div className="cafe-body">
      <Board onSelectBoard={handleBoardSelect} />
      <div className="cafe-middle-container">
        <Cafe session={session} boardState={boardState} />
      </div>
      <div className="margin"></div>
    </div>
  );
}
