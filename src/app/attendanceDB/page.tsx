"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./style.css";

export default function FileListPage() {
  // API에서 받아온 전체 데이터 상태 (night와 eight 리스트 포함)
  const [data, setData] = useState(null);
  // 현재 보여줄 리스트 타입 (초기값은 8교시)
  const [currentView, setCurrentView] = useState("eight");

  // 컴포넌트 마운트 시 API 호출 (오늘 날짜 기준)
  useEffect(() => {
    axios
      .get("/api/atList")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("파일 목록을 불러오지 못했습니다.", error);
      });
  }, []);

  if (!data) {
    return <div>로딩중...</div>;
  }

  // 보여줄 파일 리스트: 8교시와 야자에 따라 분리
  const fileList = currentView === "eight" ? data.eight : data.night;
  const downloadFile = (file) => {
    // 만약 file.link가 "http"로 시작하면 URL로 간주
    if (file.link.startsWith("http")) {
      const a = document.createElement("a");
      a.href = file.link;
      // 같은 출처가 아니라면 download 속성이 무시될 수 있으므로, 새 창으로 열도록 합니다.
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // base64 문자열 등이라면 Blob으로 변환
      try {
        // base64 문자열에서 MIME 타입 추출 (예: "data:application/pdf;base64,.....")
        let mimeType = "";
        let base64Data = file.link;
        if (file.link.startsWith("data:")) {
          const parts = file.link.split(",");
          const meta = parts[0];
          base64Data = parts[1];
          const mimeParts = meta.match(/data:(.*);base64/);
          mimeType = mimeParts && mimeParts[1] ? mimeParts[1] : "";
        } else {
          // file.link가 순수 base64 문자열이라면, 파일 타입에 따라 지정 (예: pdf, excel)
          mimeType =
            file.type === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = file.type === "pdf" ? "attendance.pdf" : "attendance.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("다운로드 처리 중 오류 발생:", error);
        alert("파일 다운로드 중 오류가 발생했습니다.");
      }
    }
  };
  return (
    <div className="right-left-margin">
      <div className="container">
        <div className="controls">
          <button
            className={`btn ${currentView === "eight" ? "active" : ""}`}
            onClick={() => setCurrentView("eight")}
          >
            8교시 파일 리스트
          </button>
          <button
            className={`btn ${currentView === "night" ? "active" : ""}`}
            onClick={() => setCurrentView("night")}
          >
            야자 파일 리스트
          </button>
        </div>
        <div className="file-list">
          {fileList && fileList.length > 0 ? (
            <div className="table-container">
              <div>
                {fileList.map((file) => (
                  <div
                    style={{
                      background:
                        file.type === "pdf"
                          ? "linear-gradient(135deg,rgba(227, 150, 154, 0.45) ,rgb(255, 198, 196) 100%)"
                          : "linear-gradient(135deg,rgba(147, 172, 219, 0.51) ,rgb(172, 201, 255) 100%)",
                    }}
                    className="attendance-student"
                    key={file.id}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="attendance-student-title-display">
                        <div className="attendance-student-title">
                          <p className="attendance-student-name">
                            {file.author || "-"}
                          </p>
                        </div>
                        <p className="attendance-student-number">
                          {file.createdAt}
                          <div>{file.grade}학년</div>
                        </p>
                      </div>
                      <div className="attendance-student-button">
                        <button
                          style={{
                            cursor: "pointer",
                            background: "none",
                            border: "none",
                            fontWeight: "bold",
                            fontSize: "13px",
                          }}
                          onClick={() => downloadFile(file)}
                        >
                          {file.type} / 다운로드
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>조회된 파일이 없습니다.</p>
          )}
        </div>
      </div>{" "}
    </div>
  );
}
