"use client";

import axios from "axios";

export default function Page() {
  function deleteFile1() {
    axios.delete("/api/deleteFile1", {
      params: {
        targetDB: "attendanceObjectDB3",
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
        <button
          onClick={() => {
            deleteFile1();
          }}
          className="ok-button"
        >
          8교시 출석 취소
        </button>
        <button className="ok-button">야자 출석 취소</button>
      </div>
    </div>
  );
}
