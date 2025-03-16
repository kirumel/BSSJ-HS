"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import "../attendance/style.css";

import SuccessModal from "../successModal/page";
import "./style.css";
import axios from "axios";
import SelectStudentModal from "./selectStudentModal";
import Loading from "../loading/page";

const todayDate = new Date();

// 날짜를 보기 좋게 포맷팅
const formattedDate: string = todayDate.toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

interface Attendance {
  secondNumber: any;
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

export default function Page() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firstcommitstudent, setFirstCommitStudent] = useState<
    {
      secondNumber: string;
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
    if (!selectedClass) {
      return attendance;
    }
    return attendance.filter(
      (student) => student.class === parseInt(selectedClass)
    );
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
          // 반과 학생번호 순으로 정렬: 먼저 반 기준, 같은 반이면 학생번호 기준
          const sortedData = data.sort((a, b) => {
            const classA = parseInt(a.class as unknown as string);
            const classB = parseInt(b.class as unknown as string);
            if (classA !== classB) {
              return classA - classB;
            }
            return parseInt(a.studentnumber) - parseInt(b.studentnumber);
          });

          const sortedData3 = sortedData.filter(
            (student) => student.grade === 3
          );

          const presentStudents = sortedData3.filter(
            (student) => student.check !== "0"
          );
          const absentStudents = sortedData3.filter(
            (student) => student.check === "0"
          );
          const finalSortedData = [...presentStudents, ...absentStudents];

          // 오늘 날짜로 formattedDate 설정
          const todayDate = new Date();
          const formattedDate = todayDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          // updatedAt과 비교 후 check, comment 수정된 데이터
          const updatedFinalData = finalSortedData.map((student) => {
            const isUpdatedToday = student.updatedAt === formattedDate;

            return {
              ...student,
              check: isUpdatedToday ? student.check : "", // 오늘 날짜가 아니면 초기화
              comment: isUpdatedToday ? student.comment : "", // 오늘 날짜가 아니면 초기화
            };
          });

          // setAttendance로 수정된 데이터 반영
          setAttendance(updatedFinalData);

          // firstCommitStudent 데이터 초기화
          const initialFirstCommitStudent = updatedFinalData.map((student) => ({
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
            secondNumber: student.secondNumber,
          }));
          setFirstCommitStudent(initialFirstCommitStudent);
        } else {
          console.error(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 호출 중 오류 발생:", error);
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

  const handleStateChange = (newState: any) => {
    setFirstCommitStudent((prevState) =>
      prevState.map((student) => {
        // 새로운 상태(newState)에서 해당 학생 정보를 찾습니다.
        const updatedStudent = newState.find(
          (newStudent: { id: string }) => newStudent.id === student.id
        );
        return updatedStudent
          ? {
              ...student,
              check: updatedStudent.check,
              comment: updatedStudent.comment,
            }
          : student;
      })
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

  const validation = useMemo(() => {
    const errorCounts: { [msg: string]: number } = {};

    // 각 학생마다 한 가지 오류만 기록합니다.
    for (const student of firstcommitstudent) {
      let errorMessageForStudent: string | null = null;
      if (!["0", "1", "2"].includes(student.check)) {
        errorMessageForStudent = "출석 여부가 선택되지 않았습니다.";
      } else if (student.check === "0" || student.check === "2") {
        if (!student.comment) {
          errorMessageForStudent = "미출석 사유가 입력되지 않았습니다.";
        }
      }

      if (errorMessageForStudent) {
        errorCounts[errorMessageForStudent] =
          (errorCounts[errorMessageForStudent] || 0) + 1;
      }
    }

    // 전체 학생 중 가장 많이 발생한 오류 메시지를 선택
    let mostCommonError = "";
    let maxCount = 0;
    for (const [msg, count] of Object.entries(errorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonError = msg;
      }
    }

    if (mostCommonError) {
      const errorMessage =
        maxCount > 1 ? `다수의 ${mostCommonError}` : mostCommonError;
      return { error: errorMessage, disabled: true };
    }
    return { error: "", disabled: false };
  }, [firstcommitstudent]);

  const handlePatch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/post/filegenerater3/choiceATsupervisor2",
        {
          firstcommitstudent,
        }
      );
      const response2 = await axios.post(
        "/api/post/filegenerater3/choiceATsupervisor",
        {
          firstcommitstudent,
        }
      );

      const response3 = await axios.post("/api/post/compareAT", {
        firstcommitstudent,
        grade: "3",
        formattedDate,
      });
      const reset = await axios.patch("/api/post/resetAttendance", {});

      if (
        response.status === 200 &&
        response2.status === 200 &&
        response3.status === 200 &&
        reset.status === 200
      ) {
        setSuccessModalTimer();
        setIsLoading(false);
      } else {
        console.log(response.data.message);
        alert("저장 실패");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const setSuccessModalTimer = () => {
    setSuccessModal(true);
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
    return <Loading />;
  }

  if (attendance.length === 0) {
    return <div>이런! 오류가 발생했거나 학생들의 정보가 등록이 필요해요</div>;
  }

  return (
    <div className="right-left-margin">
      <div>{successModal ? <SuccessModal props={successModal} /> : null}</div>
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
      {validation.error && (
        <p
          style={{
            color: "red",
            fontSize: "11px",
            margin: "0px",
            lineHeight: "1",
          }}
        >
          {validation.error}
        </p>
      )}
      <div className="attendance-container">
        {filteredStudents.map((data, i) => {
          const studentCommit = firstcommitstudent.find(
            (student) => student.id === data.id
          ) || { check: "", comment: "" };

          // check가 "2"인 경우: 배경 회색, 선택 버튼(체크박스) 삭제
          if (studentCommit.check === "2") {
            return (
              <div key={i}>
                <div
                  style={{ backgroundColor: "#d8d8d8" }}
                  className="attendance-student"
                  key={data.id}
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
                        <p className="attendance-student-name">{data.name}</p>
                        <p className="attendance-student-gradeandclass">
                          {data.grade}학년 {data.class}반
                        </p>
                      </div>
                      <p className="attendance-student-number">
                        {data.studentnumber}번
                      </p>
                    </div>
                    <div className="attendance-student-button">
                      미출석 / {data.comment || ""}
                    </div>
                  </div>
                </div>
                {(i === filteredStudents.length - 1 ||
                  filteredStudents[i + 1].class !== data.class) && (
                  <div
                    className="line"
                    style={{
                      backgroundColor: "blue",
                      height: "1px",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  ></div>
                )}
              </div>
            );
          } else {
            // check가 "0" 또는 "1"인 경우: 기존 로직 그대로 체크박스 및 입력창 표시
            return (
              <div key={i}>
                <div
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
                  className="attendance-student"
                  key={data.id}
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
                    </div>
                    <div>
                      {studentCommit.check === "0" ? (
                        <div
                          style={{ marginBottom: "20px" }}
                          className="attendance-student-nocheck-comment"
                        >
                          <p
                            style={{ marginBottom: "5px" }}
                            className="subtitle"
                          >
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
                        <h5>
                          미출석
                          <br />
                          이유 : {data?.comment}
                        </h5>
                      ) : (
                        <div
                          style={{ display: "flex", justifyContent: "right" }}
                        >
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
                {(i === filteredStudents.length - 1 ||
                  filteredStudents[i + 1].class !== data.class) && (
                  <div
                    className="line"
                    style={{
                      backgroundColor: "blue",
                      height: "1px",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  ></div>
                )}
              </div>
            );
          }
        })}
      </div>
      <button
        className="ok-button"
        onClick={handlePatch}
        disabled={validation.disabled}
      >
        출석 정보 저장
      </button>
    </div>
  );
}
