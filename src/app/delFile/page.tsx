"use client";

import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [selectedGrade, setSelectedGrade] = useState(3);

  function deleteFile1() {
    axios.delete("/api/deleteFile", {
      params: {
        targetDB: `attendanceObjectDB${selectedGrade}`,
      },
    });
  }

  function deleteFile2() {
    axios.delete("/api/deleteFile1", {
      params: {
        grade: selectedGrade,
      },
    });
  }

  return (
    <div
      style={{
        height: "calc(100vh - 144px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "10vw",
        }}
      >
        <h2>출석 취소</h2>
        <div>
          <label htmlFor="grade-select">학년 선택: </label>
          <select
            id="grade-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value))}
          >
            <option value={1}>1학년</option>
            <option value={2}>2학년</option>
            <option value={3}>3학년</option>
          </select>
        </div>
        <button onClick={deleteFile1} className="ok-button">
          8교시 출석 취소
        </button>
        <button onClick={deleteFile2} className="ok-button">
          야자 출석 취소
        </button>
      </div>
    </div>
  );
}
