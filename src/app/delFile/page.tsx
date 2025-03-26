"use client";

import axios from "axios";
import { useState } from "react";
import SuccessModal from "../successModal/page";

export default function Page() {
  const [selectedGrade, setSelectedGrade] = useState(3);

  const [successModal, setsuccessModal] = useState(false);
  const [successModal2, setsuccessModal2] = useState(false);

  function deleteFile1() {
    axios
      .delete("/api/deleteFile", {
        params: {
          targetDB: `attendanceObjectDB${selectedGrade}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.count === 0) {
            setsuccessModal2(true);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          } else {
            setsuccessModal(true);
          }
        }
      });
  }

  function deleteFile2() {
    axios
      .delete("/api/deleteFile1", {
        params: {
          grade: selectedGrade,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.count === 0) {
            setsuccessModal2(true);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          } else {
            setsuccessModal(true);
          }
        }
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
      {successModal && (
        <SuccessModal name="성공!" content="2차 출석 파일들이 삭제되었습니다" />
      )}
      {successModal2 && (
        <SuccessModal name="확인 필요" content="2차 출석의 파일이 없습니다" />
      )}
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
