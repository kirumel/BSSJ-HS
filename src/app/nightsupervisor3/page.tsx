"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "../attendance/style.css";

import SuccessModal from "./successModal";
import "./style.css";
import axios from "axios";
import SelectStudentModal from "./selectStudentModal";

interface Attendance {
  outTimeST: string;
  outTimeT: string;
  name: string;
  updatedAt: string;
  comment: string;
  check: string;
  author: string;
  grade: number;
  class: number;
  studentnumber: string;
  createdAt: string;
  id: string;
}

const todayDate = new Date();
const today = new Date();
const isToday = todayDate.toDateString() === today.toDateString();

// 날짜를 보기 좋게 포맷팅
const formattedDate = todayDate.toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function Page() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firstcommitstudent, setFirstCommitStudent] = useState<
    {
      outTimeST: string;
      name: string;
      updatedAt: string;
      comment: string;
      check: string;
      author: string;
      studentnumber: string;
      createdAt: string;
      id: string;
      class: number;
      grade: number;
      outTimeT: string;
    }[]
  >([]);
  const { data: session } = useSession();
  const [successModal, setSuccessModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // 선택된 반에 따라 필터링
  const getFilteredStudents = () => {
    if (!selectedClass) {
      return attendance;
    }
    return attendance.filter(
      (student) => student.class === parseInt(selectedClass)
    );
  };

  // 반 리스트 가져오기
  const getClassList = () => {
    const classSet = new Set(attendance.map((student) => student.class));
    return Array.from(classSet).sort((a, b) => a - b);
  };

  const filteredStudents = getFilteredStudents();
  const classList = getClassList();

  // id를 기준으로 시간 입력값 업데이트
  const handleTimeChange = (id: string, field: string, value: string) => {
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

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
        "/api/post/nightAT/fetchTime2",
        { firstcommitstudent },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        setSuccessModalTimer();
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

  // 다른 컴포넌트에서 학생 정보를 업데이트할 때 사용하는 함수 (학생 id 기준)
  const handleStateChange = (newState: any) => {
    setFirstCommitStudent((prevState) =>
      prevState.map((student) => {
        const updatedStudent = newState.find(
          (newStudent: { id: string }) => newStudent.id === student.id
        );
        return updatedStudent
          ? {
              ...student,
              check: updatedStudent.check,
              comment: updatedStudent.comment,
              outTimeST: updatedStudent.outTimeST,
            }
          : student;
      })
    );
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

  // 24시간 형식을 12시간 형식으로 변환하는 함수
  function convertTo12Hour(time24: string) {
    if (!time24) return "설정된 시간 없음";
    let [hours, minutes] = time24.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  // 저장 버튼 활성화 여부 판단 함수
  const isSaveDisabled = () => {
    return firstcommitstudent.some((student) => {
      console.log(!["0", "1", "2"].includes(student.check));
      console.log(!student.outTimeST?.trim());
      if (
        !["0", "1", "2"].includes(student.check) ||
        !student.outTimeST?.trim() ||
        ((student.check === "0" || student.check === "2") &&
          !student.comment?.trim())
      ) {
        return true;
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/nightAT/page")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          const sortedData = data.sort((a, b) => {
            if (a.class !== b.class) {
              return a.class - b.class;
            }
            return parseInt(a.studentnumber) - parseInt(b.studentnumber);
          });
          const sortedData1 = sortedData.filter(
            (student) => student.grade === 3
          );

          const presentStudents = sortedData1.filter(
            (student) => student.check !== "0"
          );
          const absentStudents = sortedData1.filter(
            (student) => student.check === "0"
          );
          const finalSortedData = [...presentStudents, ...absentStudents];
          setAttendance(finalSortedData);

          const initialFirstCommitStudent = finalSortedData.map((student) => ({
            id: student.id,
            updatedAt: formattedDate,
            name: student.name,
            class: student.class,
            grade: student.grade,
            studentnumber: student.studentnumber,
            // 미출석인 경우 미리 "2"로 셋팅, 이후 체크박스 변경 시 "0" 또는 "1"로 업데이트됨
            check: student.check === "0" ? "2" : "",
            outTimeT: student.outTimeT || "",
            outTimeST: student.outTimeT || "",
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

  if (isLoading) {
    return <div className="loading">잠시만 기다려주세요...</div>;
  }

  if (attendance.length === 0) {
    return (
      <div>
        <div>이런! 오류가 발생했거나 학생들의 정보가 등록이 필요해요</div>
      </div>
    );
  } else {
    return (
      <div className="right-left-margin">
        {successModal && <SuccessModal props={successModal} />}
        <div className="attendance-top-container-display">
          <div className="attendance-top-in1">
            <p>총 인원: {attendance.length}</p>
            <p>미출석: {countAbsentStudentsNO()}</p>
            <p>출석: {countAbsentStudentsOK()}</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
            <SelectStudentModal
              props={firstcommitstudent}
              setAttendance={handleStateChange}
            />
          </div>
        </div>

        <div className="attendance-container">
          {filteredStudents.map((data) => {
            const studentCommit = firstcommitstudent.find(
              (student) => student.id === data.id
            ) || {
              check: "",
              comment: "",
            };
            return (
              <div
                key={data.id}
                className="attendance-student"
                style={{
                  backgroundColor:
                    studentCommit.check === "0"
                      ? "#FFE8E8"
                      : studentCommit.check === "1"
                      ? "#E8E8FF"
                      : data.check === "0"
                      ? "#E8E8E8"
                      : "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems:
                      studentCommit.check === "0" ? "normal" : "center",
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
                    <p className="attendance-student-number">
                      설정된 퇴장시간 : {convertTo12Hour(data.outTimeT)}
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
                      <div>
                        <h5>
                          미출석
                          <br />
                          이유 : {data?.comment}
                        </h5>
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <div style={{ marginRight: "20px" }}>
                          <input
                            style={{
                              backgroundColor:
                                studentCommit.outTimeST === data.outTimeT
                                  ? "#E8E8E8"
                                  : "#E8E8FF",
                            }}
                            className="time-input"
                            type="time"
                            value={studentCommit.outTimeST || ""}
                            onChange={(e) =>
                              handleTimeChange(
                                data.id,
                                "outTimeST",
                                e.target.value
                              )
                            }
                          />
                        </div>
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
        {/* 저장 버튼은 isSaveDisabled()가 true이면 disabled 처리 */}
        <button
          className="ok-button"
          onClick={handlePatch}
          disabled={isSaveDisabled()}
        >
          출석 정보 저장
        </button>
      </div>
    );
  }
}
