"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import SelectStudentModal from "./selectStudentModal";

interface Student {
  id: string;
  createdAt: string;
  grade: number;
  // …기타 필드…
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    axios
      .get<Student[]>("/api/post/allFile/vac")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("전체 학생 조회 실패", err));
  }, []);

  const handleExport = async () => {
    if (!selectedGrade || !startDate || !endDate) {
      alert("학년과 시작/종료 날짜를 모두 선택해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/post/allFile/vac",
        { grade: selectedGrade.toString(), startDate, endDate },
        { responseType: "blob" }
      );

      // 브라우저 다운로드 트리거
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${startDate}_to_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("엑셀 다운로드 실패", err);
      alert("엑셀 파일 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="containerK">
      <h1 className="sectionTitle">야자 출석 병합 beta</h1>
      <div className="section">
        <div className="sectionTitle">학년 선택</div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="select"
        >
          <option value="">학년 선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>

      <div className="section">
        <div className="sectionTitle">날짜 범위 선택</div>
        <div className="dateInputs">
          <div>
            <div className="sectionTitle">시작 날짜</div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
              max={endDate || undefined}
            />
          </div>
          <div>
            <div className="sectionTitle">종료 날짜</div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
              min={startDate || undefined}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <button onClick={handleExport} className="export-button">
          엑셀 내보내기
        </button>
        <SelectStudentModal props={students} />
      </div>
    </div>
  );
}
