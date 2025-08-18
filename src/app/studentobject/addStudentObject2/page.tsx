"use client";
import { useState } from "react";
import Head from "next/head";
import ExcelJS from "exceljs";
import "./style.css";
import "../../attendance/style.css";
import axios from "axios";

interface Student {
  secondNumber: ReactNode;
  name: string;
  class: string;
  grade: string;
  studentnumber: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      readExcelAndSaveToDatabase(selectedFile);
    }
  };

  // 학생 번호 추출 함수
  const extractStudentNumber = (studentnumber: string) => {
    if (studentnumber.length === 2) {
      return studentnumber.startsWith("0")
        ? studentnumber.slice(1)
        : studentnumber;
    }
    if (studentnumber.length >= 4) {
      return studentnumber.slice(-2);
    }
    return studentnumber;
  };

  // 엑셀 파일 읽기 및 학생 정보 추출

  const parseScheduleFromBigo = (bigo: string) => {
    const dayMap = {
      월: "mon",
      화: "tue",
      수: "wed",
      목: "thu",
      금: "fri",
    };

    const result: Record<string, { time: string; checked: string }> = {
      mon: { time: "", checked: "0" },
      tue: { time: "", checked: "0" },
      wed: { time: "", checked: "0" },
      thu: { time: "", checked: "0" },
      fri: { time: "", checked: "0" },
    };

    // ✅ "월수금 9시 반", "화목 10시", "월~수 8시 반" 등 인식
    const regex = /([월화수목금-]+)\s*(\d{1,2})시(?:\s*반)?/g;
    let match;

    while ((match = regex.exec(bigo)) !== null) {
      const days = match[1]; // 요일 묶음
      const hour = parseInt(match[2], 10); // 시
      const hasHalf = match[0].includes("반"); // "반" 포함 여부

      const hour24 = hour === 12 ? 12 : hour + 12;
      const time = `${String(hour24).padStart(2, "0")}:${
        hasHalf ? "30" : "00"
      }`;

      if (days.includes("-")) {
        const [start, end] = days.split("-");
        const korDays = Object.keys(dayMap);
        const startIdx = korDays.indexOf(start);
        const endIdx = korDays.indexOf(end);
        korDays.slice(startIdx, endIdx + 1).forEach((d) => {
          const key = dayMap[d];
          result[key] = { time, checked: "1" };
        });
      } else {
        [...days].forEach((d) => {
          const key = dayMap[d];
          if (key) {
            result[key] = { time, checked: "1" };
          }
        });
      }
    }

    return result;
  };

  const parseStudentNumber = function (studentNumber: any) {
    const strNum = studentNumber.toString().padStart(4, "0"); // 4자리 유지
    return {
      grade: parseInt(strNum[0], 10), // 첫 번째 숫자 = 학년
      class: parseInt(strNum[1], 10), // 두 번째 숫자 = 반
      number: parseInt(strNum.slice(2), 10), // 마지막 두 자리 = 번호
    };
  };

  const readExcelAndSaveToDatabase = async (file: File) => {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];

    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values as string[];

    const cleanedHeaders = headers
      .filter((header) => header !== null)
      .map((header) => header.trim().toLowerCase());

    const chairIndex = cleanedHeaders.indexOf("좌석");
    const nameIndex = cleanedHeaders.indexOf("이름");
    const classIndex = cleanedHeaders.indexOf("반");
    const gradeIndex = cleanedHeaders.indexOf("학년");
    const studentALLNumberIndex = cleanedHeaders.indexOf("학번");
    const studentNumberIndex = cleanedHeaders.indexOf("번호");
    const bigoIndex = cleanedHeaders.indexOf("비고");

    if (
      (studentALLNumberIndex &&
        (studentNumberIndex === -1 ||
          classIndex === -1 ||
          gradeIndex === -1)) ||
      ((studentNumberIndex || classIndex || gradeIndex) &&
        studentALLNumberIndex === -1)
    ) {
      if (chairIndex === -1 || nameIndex === -1 || bigoIndex === -1) {
        alert("필수 열이 엑셀 파일에 존재하지 않습니다.");
        return;
      }
    } else {
      alert("필수 열이 엑셀 파일에 존재하지 않습니다.");
      return;
    }

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      if (
        studentALLNumberIndex &&
        (studentNumberIndex === -1 || classIndex === -1 || gradeIndex === -1)
      ) {
        const chair = row.getCell(chairIndex + 1)?.value?.toString() ?? "";
        const name = row.getCell(nameIndex + 1)?.value ?? "";

        const studentNumber =
          row.getCell(studentALLNumberIndex + 1)?.value ?? "";

        const {
          grade,
          class: classNum,
          number,
        } = parseStudentNumber(studentNumber);

        const bigo = row.getCell(bigoIndex + 1)?.value?.toString() ?? "";

        const schedule = parseScheduleFromBigo(bigo);
        setStudents((prevStudents) => [
          ...prevStudents,
          {
            secondNumber: chair.toString(),
            name: name.toString(),
            class: classNum.toString(),
            grade: grade.toString(),
            studentnumber: number.toString(),
            monTime: schedule.mon.time,
            monChecked: schedule.mon.checked,
            tueTime: schedule.tue.time,
            tueChecked: schedule.tue.checked,
            wedTime: schedule.wed.time,
            wedChecked: schedule.wed.checked,
            thuTime: schedule.thu.time,
            thuChecked: schedule.thu.checked,
            friTime: schedule.fri.time,
            friChecked: schedule.fri.checked,
          },
        ]);
      } else if (
        (studentNumberIndex || classIndex || gradeIndex) &&
        studentALLNumberIndex === -1
      ) {
        const chair = row.getCell(chairIndex + 1)?.value?.toString() ?? "";
        const name = row.getCell(nameIndex + 1)?.value ?? "";
        const className = row.getCell(classIndex + 1)?.value ?? "";
        const grade = row.getCell(gradeIndex + 1)?.value ?? "";
        const studentNumber = row.getCell(studentNumberIndex + 1)?.value ?? "";
        const bigo = row.getCell(bigoIndex + 1)?.value?.toString() ?? "";

        const schedule = parseScheduleFromBigo(bigo);
        setStudents((prevStudents) => [
          ...prevStudents,
          {
            secondNumber: chair,
            name: name.toString(),
            class: className.toString(),
            grade: grade.toString(),
            studentnumber: studentNumber.toString(),
            monTime: schedule.mon.time,
            monChecked: schedule.mon.checked,
            tueTime: schedule.tue.time,
            tueChecked: schedule.tue.checked,
            wedTime: schedule.wed.time,
            wedChecked: schedule.wed.checked,
            thuTime: schedule.thu.time,
            thuChecked: schedule.thu.checked,
            friTime: schedule.fri.time,
            friChecked: schedule.fri.checked,
          },
        ]);
      } else {
        alert("열 배열이 조건을 충족하지 않습니다");
      }
    });
  };

  const saveToDatabase = async (students: Student[]) => {
    try {
      const response = await axios.post("/api/post/nightUpload-students", {
        students,
      });

      if (response.status === 200) {
        alert("학생 정보 저장 완료");
        setStudents([]);
      } else {
        console.log("학생 저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error saving to database", error);
    }
  };

  return (
    <>
      {students.length > 0 && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              style={{ float: "right" }}
              onClick={() => {
                setStudents([]);
                const input = document.querySelector('input[type="file"]');
                if (input) {
                  input.value = "";
                }
              }}
            >
              &times;
            </span>
            <h3 style={{ marginBottom: 0 }}>학생 목록 확인</h3>
            <p className="subtitle" style={{ fontSize: "10px", margin: 0 }}>
              엑셀파일만 지원됩니다
            </p>
            <div>
              <div>
                <div
                  className="attendance-container"
                  style={{ height: "50vh", width: "70vw" }}
                >
                  {students.map((data, index: number) => (
                    <div key={index} className="attendance-student">
                      <div>
                        <div className="admin-student-display">
                          <div
                            className="attendance-student-title"
                            style={{ margin: 0 }}
                          >
                            <p className="attendance-student-name">
                              {data.name}
                            </p>
                            <p
                              className="attendance-student-gradeandclass"
                              style={{ fontSize: "10px" }}
                            >
                              {data.grade}학년 {data.class}반
                            </p>
                          </div>
                          <div>
                            <p className="attendance-student-number">
                              {data.studentnumber}번
                            </p>{" "}
                            <p className="attendance-student-number">
                              좌석 : {data.secondNumber}
                            </p>
                          </div>
                        </div>

                        {/* 요일별 시간 표시 */}
                        <div
                          style={{
                            fontSize: "10px",
                            marginTop: "4px",
                            color: "#555",
                          }}
                        >
                          {[
                            { label: "월", time: data.monTime },
                            { label: "화", time: data.tueTime },
                            { label: "수", time: data.wedTime },
                            { label: "목", time: data.thuTime },
                            { label: "금", time: data.friTime },
                          ].map(({ label, time }) => (
                            <span key={label} style={{ marginRight: "6px" }}>
                              {label}: {time || "없음"}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {students.length > 0 && (
              <button
                className="ok-button"
                onClick={() => saveToDatabase(students)}
              >
                확인 후 업로드
              </button>
            )}
          </div>
        </div>
      )}
      <div className="containerA">
        <div className="upload-box">
          <h3 style={{ marginBottom: 0 }}>학생 업로드</h3>
          <p className="subtitle" style={{ fontSize: "10px", margin: 0 }}>
            (이름/학년/번호/반) 항목이 있는지 확인해주세요!
            <br />
            (위 항목 제외 나머지 항목은 수집하지 않습니다)
          </p>
          <input
            className="file-input"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
}
