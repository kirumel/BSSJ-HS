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

interface PageProps {
  onSelectBoard: (boardId: string) => void;
}

export default function Page({ onSelectBoard }: PageProps) {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "cm837yu2f0000r1ud0exdpgqp",
      name: "자유게시판",
      description: "자유임",
    },
  ]);
  const { data: session } = useSession();
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    "cm837yu2f0000r1ud0exdpgqp"
  );

  useEffect(() => {
    if (session) {
      axios
        .get("/api/board/boards")
        .then((response) =>
          setBoards(response.data.filter((board) => board.name !== "feed"))
        );
    }
  }, [session]);

  if (!boards)
    return (
      <div className="video-container">
        <Loading />
      </div>
    );

  if (boards.length === 0) {
    return <p></p>;
  }

  if (!session) {
    return <p>로그인 후 게시판을 확인해주세요</p>;
  }

  // Handle board button click
  const handleBoardClick = (boardId: string) => {
    setSelectedBoardId(boardId === selectedBoardId ? null : boardId); // Toggle selection
    onSelectBoard(boardId); // Call the callback function
  };
  console.log(boards);
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
            >
              <h3 className="title" style={{ marginRight: "10px" }}>
                {board.name}📄
              </h3>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
