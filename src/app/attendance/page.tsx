"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import "./style.css";

import PlusStudentModal from "./plusStudentModal";
import SuccessModal from "../successModal/page";

import { Slide, ToastContainer, toast } from "react-toastify";
import "../choiceATteacher/style.css";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import SelectStudentModal from "./selectStudentModal";

interface Attendance {
  name: string;
  content: string;
  updatedAt: string;
  check: string;
  author: string;
  grade: string;
  class: string;
  studentnumber: string;
  id: string;
}

interface FirstCommitStudent {
  id: string;
  updatedAt?: string;
  name?: string;
  grade?: string;
  class?: string;
  studentnumber?: string;
  check: string;
  comment: string;
  author: string;
}

export default function Page() {
  const { data: session } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firstcommitstudent, setFirstCommitStudent] = useState<
    FirstCommitStudent[]
  >([]);
  const [successModal, setSuccessModal] = useState(false);

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

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/attendance")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          const sortedData = data.sort(
            (a, b) => parseInt(a.studentnumber) - parseInt(b.studentnumber)
          );
          const sortedfilteredData = sortedData.filter(
            (student) =>
              student.grade === session?.user?.grade &&
              student.class === session?.user?.class
          );
          setAttendance(sortedfilteredData);
          const todayDate = new Date();
          const formattedDate = todayDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          const initialFirstCommitStudent: FirstCommitStudent[] =
            sortedfilteredData.map((student) => ({
              id: student.id,
              updatedAt: formattedDate,
              name: student.name,
              grade: student.grade,
              class: student.class,
              studentnumber: student.studentnumber,
              check: "",
              comment: "",
              author: session?.user?.name || "",
            }));
          setFirstCommitStudent(initialFirstCommitStudent);
        } else {
          console.error(data);
        }
        setIsLoading(false);
      });
  }, [session]);

  // id 기반으로 comment와 체크 상태 업데이트
  const handleCommitChange = (id: string, field: string, value: string) => {
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  // 출석 버튼("y") 누르면 comment를 빈 문자열("")로 등록
  const handleCheckboxChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              check: event.target.name === "n" ? "0" : "1",
              // 출석(체크박스 이름이 "y")일 경우 comment를 빈 문자열로 설정
              comment: event.target.name === "y" ? "" : student.comment,
            }
          : student
      )
    );
  };

  const handlePatch = () => {
    setIsLoading(true);
    axios
      .patch(
        "/api/post/attendance",
        { firstcommitstudent, grade: session?.user?.grade },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 202) {
          setIsLoading(false);
          toast(response.data);
        } else {
          setIsLoading(false);
          setSuccessModal(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        toast("예상치 못한 오류가 발생하였습니다");
      });

    localStorage.setItem("compareAT", JSON.stringify(firstcommitstudent));
  };

  const countAbsentStudentsNO = () => {
    return firstcommitstudent.filter((student) => student.check === "0").length;
  };
  const countAbsentStudentsOK = () => {
    return firstcommitstudent.filter((student) => student.check === "1").length;
  };

  const handleStateChange = (newState: any) => {
    setFirstCommitStudent((prevState) =>
      prevState.map((student) => {
        const updatedStudent = newState.find(
          (newStudent: { id: string }) => newStudent.id === student.id
        );
        if (updatedStudent.check === "1") {
          return updatedStudent
            ? {
                ...student,
                check: updatedStudent.check,
                comment: "",
              }
            : student;
        } else {
          return updatedStudent
            ? {
                ...student,
                check: updatedStudent.check,
                comment: updatedStudent.comment,
              }
            : student;
        }
      })
    );
  };

  if (isLoading) {
    return <div className="loading">잠시만 기다려주세요...</div>;
  }

  if (attendance.length === 0) {
    return (
      <>
        <div>이런! 등록하신 반 학생들의 정보가 없어요</div>
        <button onClick={() => setModalOpen(true)}>등록하기</button>
        {modalOpen && (
          <PlusStudentModal
            props={setAttendance}
            closeModal={() => setModalOpen(false)}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          transition={Slide}
          closeButton={false}
        />

        <div className="right-left-margin">
          <div>
            {successModal && (
              <SuccessModal
                name={"성공!"}
                content={"1차 출석이 저장되었어요"}
              />
            )}
          </div>
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
              <button
                className="plus-attendance-button"
                onClick={() => setModalOpen(true)}
              >
                학생 추가
              </button>
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
            {attendance.map((data) => {
              const studentData = firstcommitstudent.find(
                (student) => student.id === data.id
              );
              return (
                <div
                  key={data.id}
                  style={{
                    backgroundColor:
                      studentData?.check === "0"
                        ? "#FFE8E8"
                        : studentData?.check === "1"
                        ? "#E8E8FF"
                        : "white",
                  }}
                  className="attendance-student"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems:
                        studentData?.check === "0" ? "normal" : "center",
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
                      {studentData?.check === "0" && (
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
                            value={studentData?.comment || ""}
                            onChange={(e) =>
                              handleCommitChange(
                                data.id,
                                "comment",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                      {studentData?.check === "1" && (
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
                      )}

                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <input
                          type="checkbox"
                          className="no-check"
                          name="n"
                          checked={studentData?.check === "0"}
                          onChange={(e) => handleCheckboxChange(data.id, e)}
                        />
                        <input
                          type="checkbox"
                          className="yes-check"
                          name="y"
                          checked={studentData?.check === "1"}
                          onChange={(e) => handleCheckboxChange(data.id, e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {modalOpen && (
            <PlusStudentModal
              props={setAttendance}
              closeModal={() => setModalOpen(false)}
            />
          )}
          <button
            className="ok-button"
            onClick={handlePatch}
            disabled={validation.disabled}
          >
            출석 정보 저장
          </button>
        </div>
      </>
    );
  }
}
