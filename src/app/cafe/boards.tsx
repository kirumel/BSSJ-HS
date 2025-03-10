"use client";
import "./cafe.css";
import Cafe from "./cafe";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios"; // pages/boards/index.tsx
import { useEffect, useState } from "react";
import Loading from "../loading/page";

type Board = {
  id: string;
  name: string;
  description?: string;
};

export default function Page() {
  const [boards, setBoards] = useState<Board[]>([]);
  const { data: session } = useSession();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null); // Add state to track selected board

  useEffect(() => {
    if (session) {
      axios
        .get("/api/board/boards")
        .then((response) => setBoards(response.data));
    }
  }, [session]);

  if (!boards)
    return (
      <div className="video-container">
        <Loading />
      </div>
    );

  if (boards.length === 0) {
    return <p>생성된 게시판이 없습니다</p>;
  }

  if (!session) {
    return <p>로그인 후 게시판을 확인해주세요</p>;
  }

  // Handle board button click
  const handleBoardClick = (boardId: string) => {
    setSelectedBoardId(boardId === selectedBoardId ? null : boardId); // Toggle selection
  };

  return (
    <>
      <div className="cafe-boards-flex">
        {boards.map((board) => (
          <div key={board.id}>
            <button
              className="board-button"
              style={{
                color: selectedBoardId === board.id ? "#000" : "#888",
              }}
              onClick={() => handleBoardClick(board.id)}
            >
              {board.name}
              {selectedBoardId === board.id && (
                <div className="board-bar"></div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="line"></div>
      {boards.map((board) => (
        <div key={board.id}>
          {selectedBoardId === board.id && (
            <div
              className="cafe-boards-flex"
              style={{
                marginTop: "10px",
                marginBottom: "0",
                paddingBottom: "0",
                justifyContent: "right",
              }}
              key={board.id}
            >
              <h3 className="title">{board.name}</h3>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
