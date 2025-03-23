"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

interface Student {
  id: string;
  createdAt: string; // ISO 문자열
  grade: number;
  // 필요한 추가 필드들...
}

interface StudentGroup {
  date: string;
  grade: number;
  students: Student[];
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [uncreatedFiles, setUncreatedFiles] = useState<StudentGroup[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  useEffect(() => {
    axios
      .get<Student[]>("/api/post/nightAT/getATnight")
      .then((response) => {
        const data = response.data;
        setStudents(data);
        groupByDateAndGrade(data);
      })
      .catch((error) => {
        console.error("데이터 조회 실패", error);
      });
  }, []);

  // 학생 데이터를 날짜와 학년별로 그룹화
  const groupByDateAndGrade = (data: Student[]) => {
    const groups: { [key: string]: StudentGroup } = {};
    data.forEach((student) => {
      // createdAt 값을 그대로 사용하거나 원하는 포맷으로 변경
      const date = student.createdAt;
      const key = `${date}-${student.grade}`;
      if (!groups[key]) {
        groups[key] = {
          date,
          grade: student.grade,
          students: [],
        };
      }
      groups[key].students.push(student);
    });
    setUncreatedFiles(Object.values(groups));
  };

  // 선택한 날짜와 학년에 대해 파일 생성 요청
  const handleCreate = async () => {
    if (!selectedDate || !selectedGrade) {
      alert("학년과 일자를 모두 선택해주세요.");
      return;
    }

    const payload = {
      date: selectedDate,
      grade: Number(selectedGrade),
    };

    try {
      const find = await axios.post("/api/post/nightAT/find", payload);
      if (find.data.length === 0) {
        alert("유저 데이터 x");
        return;
      }

      const pdfResponse = await axios.post("/api/post/nightAT/PDF", {
        payload,
      });
      if (pdfResponse.status !== 200) {
        alert("PDF 파일 생성 실패");
        return;
      }

      const xlsxResponse = await axios.post("/api/post/nightAT/xlsx", {
        payload,
      });
      if (xlsxResponse.status !== 200) {
        alert("엑셀 파일 생성 실패");
        return;
      }

      const backupResponse = await axios.post(
        "/api/post/nightAT/sevenDaysBackup",
        { payload }
      );
      if (backupResponse.status !== 200) {
        alert("백업 파일 생성 실패");
        return;
      }

      alert("파일 생성 완료");
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      alert("파일 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="containerK">
      <div className="section">
        <div className="sectionTitle">만들어지지 않은 파일</div>
        {uncreatedFiles.length > 0 ? (
          <div className="fileList">
            {uncreatedFiles.map((group, index) => (
              <div key={index} className="fileItem">
                {group.date} / 학년: {group.grade} (학생 수:{" "}
                {group.students.length})
              </div>
            ))}
          </div>
        ) : (
          <div className="noFiles">없음</div>
        )}
      </div>

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
        <div className="sectionTitle">일자 선택</div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={uncreatedFiles.length == 0}
        className="ok-button"
      >
        만들기
      </button>

      <div className="subtitle">
        참고 : 실제 퇴장시간이 입력안된 경우 2차
        <br />
        출석에서 설정된 시간으로 기입됩니다
      </div>
    </div>
  );
}
