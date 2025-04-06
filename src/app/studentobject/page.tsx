"use client";
import Addstudent from "./addStudentObject2/page";
import ShowAllStudent from "./showAllStudent/page";
import { useEffect, useState } from "react";
import "./studentObject.css";
import Show8thStudent from "./show8thStudent/page";
import ShowNightStudent from "./showNightStudent/page";

export default function Page() {
  const [student, setstudent] = useState<string[]>([]);

  // Default state setup if the array is empty
  useEffect(() => {
    if (student.length === 0) {
      setstudent(["showAllStudent"]);
    }
  }, [student]);

  // A function to determine the button color based on the selected state
  const getButtonColor = (page: string) => {
    return student.includes(page) ? "rgb(192, 183, 240)" : undefined;
  };

  return (
    <div
      style={{ paddingRight: "1rem", paddingLeft: "1rem", paddingTop: "1rem" }}
    >
      <div id="top">
        <p
          className="studentObject-title"
          style={{ marginBottom: "0px", marginTop: "0px" }}
        >
          학생 관리
        </p>
        <p className="subtitle" style={{ fontSize: "10px", marginTop: "0px" }}>
          모든 학생 목록은 그냥 저장소입니다!
        </p>
        <div className="student-buttons">
          <button
            style={{ backgroundColor: getButtonColor("addstudent") }}
            onClick={() => setstudent(["addstudent"])}
          >
            학생 추가하기
          </button>
          <button
            style={{ backgroundColor: getButtonColor("showAllStudent") }}
            onClick={() => setstudent(["showAllStudent"])}
          >
            모든 학생 목록
          </button>
          <button
            style={{ backgroundColor: getButtonColor("show8thStudent") }}
            onClick={() => setstudent(["show8thStudent"])}
          >
            8교시 학생 목록
          </button>
          <button
            style={{ backgroundColor: getButtonColor("showNightStudent") }}
            onClick={() => setstudent(["showNightStudent"])}
          >
            야자 학생 목록
          </button>
        </div>
      </div>
      {student.includes("addstudent") && <Addstudent />}
      {student.includes("showAllStudent") && <ShowAllStudent />}
      {student.includes("show8thStudent") && <Show8thStudent />}
      {student.includes("showNightStudent") && <ShowNightStudent />}
    </div>
  );
}
