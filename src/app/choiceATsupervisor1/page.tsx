"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "../attendance/style.css";

import SuccessModal from "./successModal";
import "./style.css";
import axios from "axios";

interface Attendance {
  name: string;
  updatedAt: string;
  comment: string;
  check: string;
  author: string;
  grade: string;
  class: string;
  studentnumber: string;
  createdAt: string;
  id: string;
}
const todayDate = new Date();
const today = new Date();
const isToday = todayDate.toDateString() === today.toDateString();

//날자 보기좋게
let formattedDate: string;

formattedDate = todayDate.toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firstcommitstudent, setFirstCommitStudent] = useState<
    {
      name: string;
      updatedAt: string;
      comment: string;
      check: string;
      author: string;
      studentnumber: string;
      createdAt: string;
      id: string;
    }[]
  >([]);
  const { data: session } = useSession();
  const [successModal, setSuccessModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const getFilteredStudents = () => {
    if (selectedClass === null || selectedClass == "") {
      return attendance;
    }
    return attendance.filter((student) => student.class == selectedClass);
  };

  const getClassList = () => {
    const classSet = new Set(attendance.map((student) => student.class));
    return Array.from(classSet).sort();
  };

  const filteredStudents = getFilteredStudents();
  const classList = getClassList();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/attendance")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          const sortedData = data.sort(
            (a, b) => parseInt(a.studentnumber) - parseInt(b.studentnumber)
          );
          const sortedData1 = sortedData.filter(
            (student) => student.grade == "1"
          );

          const presentStudents = sortedData1.filter(
            (student) => student.check !== "0"
          );
          const absentStudents = sortedData1.filter(
            (student) => student.check === "0"
          );
          const finalSortedData = [...presentStudents, ...absentStudents];
          setAttendance(finalSortedData);

          const initialFirstCommitStudent = sortedData.map((student) => ({
            id: student.id,
            updatedAt: formattedDate,
            name: student.name,
            class: student.class,
            grade: student.grade,
            studentnumber: student.studentnumber,
            check: student.check === "0" ? "2" : "",
            comment: student.comment || "",
            author: session?.user?.name || "",
            createdAt: student.createdAt,
          }));
          setFirstCommitStudent(initialFirstCommitStudent);
        } else {
          console.error(data);
        }
        setIsLoading(false);
      });
  }, [session]);

  const handleCommitChange = (id: string, field: string, value: string) => {
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const handleCheckboxChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checkValue = event.target.name === "n" ? "0" : "1";
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, check: checkValue } : student
      )
    );
  };

  const handlePatch = async () => {
    try {
      const response = await axios.post(
        "/api/post/filegenerater1/choiceATsupervisor2",
        {
          firstcommitstudent,
        }
      );
      const response2 = await axios.post(
        "/api/post/filegenerater1/choiceATsupervisor",
        {
          firstcommitstudent,
        }
      );

      const response3 = await axios.post("/api/post/compareAT", {
        firstcommitstudent,
        grade: "1",
        formattedDate,
      });

      if (
        response.status === 200 &&
        response2.status === 200 &&
        response3.status === 200
      ) {
        setSuccessModalTimer();
      } else {
        console.log(response.data.message);
        alert("저장 실패");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setSuccessModalTimer = () => {
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false);
    }, 2500);
  };

  const countAbsentStudentsNO = () => {
    const count1 = firstcommitstudent.filter(
      (student) => student.check === "0"
    ).length;
    const count2 = firstcommitstudent.filter(
      (student) => student.check === "2"
    ).length;
    return count1 + count2;
  };
  const countAbsentStudentsOK = () => {
    return firstcommitstudent.filter((student) => student.check === "1").length;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (attendance.length === 0) {
    return (
      <>
        <div>이런! 오류가 발생했거나 학생들의 정보가 등록이 필요해요</div>
      </>
    );
  } else {
    return (
      <div className="right-left-margin">
        <div>{successModal ? <SuccessModal props={successModal} /> : null}</div>
        <div className="attendance-top-container-display">
          <div className="attendance-top-in1">
            <p>총 인원: {attendance.length}</p>
            <p>미출석: {countAbsentStudentsNO()}</p>
            <p>출석: {countAbsentStudentsOK()}</p>
          </div>
          <select
            className="class-select"
            onChange={(e) => setSelectedClass(e.target.value)}
            value={selectedClass || ""}
          >
            <option value="">모두 보기</option>
            {classList.map((cls, index) => (
              <option key={index} value={cls}>
                {cls}반
              </option>
            ))}
          </select>
        </div>

        <div className="attendance-container">
          {filteredStudents.map((data, i) => {
            const studentCommit = firstcommitstudent.find(
              (student) => student.id === data.id
            ) || { check: "", comment: "" };
            return (
              <div
                style={{
                  backgroundColor: `${
                    studentCommit.check === "0"
                      ? "#FFE8E8"
                      : studentCommit.check === "1"
                      ? "#E8E8FF"
                      : data.check === "0"
                      ? "#E8E8E8"
                      : "white"
                  }`,
                }}
                className="attendance-student"
                key={data.id}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: `${
                      studentCommit.check == "0" ? "normal" : "center"
                    }`,
                  }}
                >
                  <div className="attendance-student-title-display">
                    <div className="attendance-student-title">
                      <p className="attendance-student-name">{data.name}</p>
                      <p className="attendance-student-gradeandclass">
                        {data.grade}학년 {data.class}반
                      </p>
                    </div>
                    <p className="attendance-student-number">
                      {data.studentnumber}번
                    </p>
                  </div>
                  <div>
                    {studentCommit.check === "0" ? (
                      <div
                        style={{ marginBottom: "20px" }}
                        className="attendance-student-nocheck-comment"
                      >
                        <p style={{ marginBottom: "5px" }} className="subtitle">
                          미출석 사유
                        </p>
                        <input
                          type="text"
                          className="text-input"
                          style={{
                            padding: "5px",
                            paddingRight: "10px",
                            paddingLeft: "10px",
                            boxSizing: "border-box",
                            fontSize: "11px",
                          }}
                          value={studentCommit.comment || ""}
                          onChange={(e) =>
                            handleCommitChange(
                              data.id,
                              "comment",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ) : null}
                    {studentCommit.check === "1" ? (
                      <p
                        style={{
                          marginBottom: "5px",
                          textAlign: "right",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#8176FE",
                        }}
                      >
                        출석
                      </p>
                    ) : null}
                    {data.check === "0" ? (
                      <>
                        <h5>
                          미출석
                          <br />
                          이유 : {data?.comment}
                        </h5>
                      </>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <input
                          type="checkbox"
                          className="no-check"
                          name="n"
                          checked={studentCommit.check === "0"}
                          onChange={(e) => handleCheckboxChange(data.id, e)}
                        />
                        <input
                          type="checkbox"
                          className="yes-check"
                          name="y"
                          checked={studentCommit.check === "1"}
                          onChange={(e) => handleCheckboxChange(data.id, e)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="ok-button" onClick={handlePatch}>
          출석 정보 저장
        </button>
      </div>
    );
  }
}
