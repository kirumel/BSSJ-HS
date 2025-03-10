"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import "../cafe.css";

export default function CreateBoardPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/board/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      // 생성 후 게시판 목록 페이지로 이동
      router.push("/cafe");
    } else {
      console.error("게시판 생성에 실패했습니다.");
    }
  };

  return (
    <div className="right-left-margin">
      <h2 className="text-2xl font-bold mb-4">게시판 만들기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="text-input"
          placeholder="게시판 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="margin-topbottom10px">
          <input
            type="text"
            className="text-input margin-topBottom10px"
            placeholder="게시판 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="ok-button">
          생성하기
        </button>
      </form>
    </div>
  );
}
