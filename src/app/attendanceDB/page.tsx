"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./style.css";
import { usePathname, useRouter } from "next/navigation";
import Loading from "../loading/page";

export default function FileListPage() {
  // 전체 데이터 상태 (night와 eight 리스트 포함)
  const [data, setData] = useState(null);
  // 현재 보여줄 리스트 타입 (초기값은 8교시)
  const [currentView, setCurrentView] = useState("eight");
  // 필터 입력 상태: 날짜와 학년
  const [filterDate, setFilterDate] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  // 적용된 필터 상태
  const [appliedFilterDate, setAppliedFilterDate] = useState("");
  const [appliedFilterGrade, setAppliedFilterGrade] = useState("");
  const router = useRouter();

  // API에서 오늘 날짜 기준 데이터 호출
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
    return <Loading />;
  }

  // 선택한 파일 리스트 (8교시 또는 야자)
  let fileList = currentView === "eight" ? data.eight : data.night;

  // 필터링 함수: 적용된 날짜 및 학년 필터 사용
  const applyFilters = () => {
    return fileList.filter((file) => {
      // 날짜 필터: file.createdAt 값이 적용된 필터 날짜와 일치하는지 확인
      // file.createdAt이 "YYYY-MM-DD" 형식의 문자열이라고 가정합니다.
      const matchDate = appliedFilterDate
        ? file.createdAt.startsWith(appliedFilterDate)
        : true;
      // 학년 필터: appliedFilterGrade가 지정되면 file.grade와 정확히 일치해야 함
      const matchGrade = appliedFilterGrade
        ? String(file.grade) === String(appliedFilterGrade)
        : true;
      return matchDate && matchGrade;
    });
  };

  const filteredList = applyFilters();

  const downloadFile = (file) => {
    if (file.link.startsWith("http")) {
      const a = document.createElement("a");
      a.href = file.link;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      try {
        let mimeType = "";
        let base64Data = file.link;
        if (file.link.startsWith("data:")) {
          const parts = file.link.split(",");
          const meta = parts[0];
          base64Data = parts[1];
          const mimeParts = meta.match(/data:(.*);base64/);
          mimeType = mimeParts && mimeParts[1] ? mimeParts[1] : "";
        } else {
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

  // 필터 초기화 함수
  const resetFilters = () => {
    setFilterDate("");
    setFilterGrade("");
    setAppliedFilterDate("");
    setAppliedFilterGrade("");
  };

  return (
    <>
      <div className="nav">
        <div className="controls">
          <button
            style={{ marginRight: "10px", fontSize: "11px" }}
            className={`btn ${currentView === "eight" ? "active" : ""}`}
            onClick={() => setCurrentView("eight")}
          >
            8교시 파일 리스트
          </button>
          <button
            style={{ marginRight: "10px", fontSize: "11px" }}
            className={`btn ${currentView === "night" ? "active" : ""}`}
            onClick={() => setCurrentView("night")}
          >
            야자 파일 리스트
          </button>
        </div>
        <button className="back-A" onClick={() => router.back()}>
          ←
        </button>
      </div>
      <div className="right-left-margin">
        <div className="containerQ">
          {/* 날짜 및 학년 필터링 컨트롤 */}
          <div className="filter-controls" style={{ marginTop: "10px" }}>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ marginRight: "5px", fontSize: "11px", width: "80px" }}
            />
            <input
              type="number"
              placeholder="학년 (예: 3)"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              style={{ marginRight: "5px", width: "20px", fontSize: "11px" }}
            />
            <button
              className="btn"
              onClick={() => {
                // 필터 적용 버튼 클릭 시, 입력된 값을 적용
                setAppliedFilterDate(filterDate);
                setAppliedFilterGrade(filterGrade);
              }}
              style={{ marginRight: "5px", fontSize: "11px" }}
            >
              필터 적용
            </button>
            <button
              className="btn"
              style={{ marginRight: "5px", fontSize: "11px" }}
              onClick={resetFilters}
            >
              초기화
            </button>
          </div>
          <div className="file-list" style={{ marginTop: "10px" }}>
            {filteredList && filteredList.length > 0 ? (
              <div className="table-container">
                <div className="slider">
                  {filteredList.map((file) => (
                    <div
                      key={file.id}
                      className="attendance-student"
                      style={{
                        background:
                          file.type === "pdf"
                            ? "linear-gradient(135deg,rgba(227, 150, 154, 0.45), rgb(255, 198, 196) 100%)"
                            : "linear-gradient(135deg,rgba(147, 172, 219, 0.51), rgb(172, 201, 255) 100%)",
                      }}
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
        </div>
      </div>
    </>
  );
}
