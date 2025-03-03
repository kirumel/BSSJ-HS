"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css"; // 일반 CSS 파일을 불러옵니다.

interface Student {
  id: string;
  createdAt: string; // ISO 문자열로 받아온다고 가정
  grade: number;
  // 추가 필드가 있다면 여기에 추가
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

  // 컴포넌트 마운트 시, nightAtSupervisor 테이블의 학생 데이터를 조회합니다.
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

  // 학생 데이터를 createdAt(날짜)와 grade(학년)별로 그룹화합니다.
  const groupByDateAndGrade = (data: Student[]) => {
    const groups: { [key: string]: StudentGroup } = {};
    data.forEach((student) => {
      // createdAt 값을 YYYY-MM-DD 형식으로 변환
      const date = new Date(student.createdAt).toISOString().slice(0, 10);
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

  // 선택한 날짜와 학년으로 파일 생성 (POST 요청)
  const handleCreate = () => {
    if (!selectedDate || !selectedGrade) {
      alert("학년과 일자를 모두 선택해주세요.");
      return;
    }
    const payload = {
      date: selectedDate,
      grade: Number(selectedGrade),
    };
    axios
      .post("/api/createFile", payload)
      .then((response) => {
        console.log("파일 생성 성공:", response.data);
        // 파일 생성 후 추가 로직(예: UI 업데이트 등) 구현 가능
      })
      .catch((error) => {
        console.error("파일 생성 실패:", error);
      });
  };

  return (
    <div className="container">
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

      <button onClick={handleCreate} className="ok-button">
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
