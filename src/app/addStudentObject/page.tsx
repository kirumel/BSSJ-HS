"use client";
import { useState } from "react";
import Head from "next/head";
import ExcelJS from "exceljs";
import "./style.css";
import "../attendance/style.css";

interface Student {
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
  const readExcelAndSaveToDatabase = async (file: File) => {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer(); // 파일을 ArrayBuffer로 변환
    await workbook.xlsx.load(arrayBuffer); // ArrayBuffer를 사용하여 엑셀 파일 읽기

    const worksheet = workbook.worksheets[0]; // 첫 번째 시트 선택

    const headerRow = worksheet.getRow(1); // 첫 번째 행은 헤더로 사용
    const headers = headerRow.values as string[];

    // null 값을 제거하고 헤더 배열을 정리
    const cleanedHeaders = headers
      .filter((header) => header !== null)
      .map((header) => header.trim().toLowerCase());

    const nameIndex = cleanedHeaders.indexOf("이름");
    const classIndex = cleanedHeaders.indexOf("반");
    const gradeIndex = cleanedHeaders.indexOf("학년");
    const studentNumberIndex = cleanedHeaders.indexOf("번호");

    // 헤더가 존재하지 않으면 종료
    if (
      nameIndex === -1 ||
      classIndex === -1 ||
      gradeIndex === -1 ||
      studentNumberIndex === -1
    ) {
      console.error("필수 열이 엑셀 파일에 존재하지 않습니다.");
      return;
    }

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // 첫 번째 행은 헤더이므로 건너뜁니다.

      const name = row.getCell(nameIndex + 1)?.value ?? ""; // 이름 열
      const className = row.getCell(classIndex + 1)?.value ?? ""; // 반 열
      const grade = row.getCell(gradeIndex + 1)?.value ?? ""; // 학년 열
      const studentNumber = row.getCell(studentNumberIndex + 1)?.value ?? ""; // 번호 열

      setStudents((prevStudents) => [
        ...prevStudents,
        {
          name: name.toString(),
          class: className.toString(),
          grade: grade.toString(),
          studentnumber: studentNumber.toString(),
        },
      ]);
    });
  };

  const saveToDatabase = async (students: Student[]) => {
    try {
      const response = await fetch("/api/upload-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students }),
      });

      if (response.ok) {
        console.log("학생들이 데이터베이스에 저장되었습니다.");
      } else {
        console.log("학생 저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error saving to database", error);
    }
  };

  return (
    <>
      <Head>
        <title>엑셀 업로드</title>
      </Head>
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
                            </p>
                          </div>
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
      <div className="container">
        <div className="upload-box">
          <h3 style={{ marginBottom: 0 }}>엑셀 업로드</h3>
          <p className="subtitle" style={{ fontSize: "10px", margin: 0 }}>
            컴퓨터에서만 사용해주세요!
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
