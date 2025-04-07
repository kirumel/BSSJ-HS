"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import "./style.css";

import PlusStudentModal from "./plusStudentModal";

import SuccessModal from "../successModal/page";

import { Slide, ToastContainer, toast } from "react-toastify";
import "../choiceATteacher/style.css";
import axios from "axios";
import SelectStudentModal from "./selectStudentModal";

interface Attendance {
  monTime: string;
  tueTime: string;
  wedTime: string;
  thuTime: string;
  friTime: string;
  comment: any;
  createdAt: any;
  secondNumber: string;
  outTimeAT: string;
  outTimeT: string;
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

export default function Page() {
  // 학생추가 모달창 스테이트
  const [modalOpen, setModalOpen] = useState(false);

  // 학생 리스트 저장 스테이트
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  // 로딩 부분
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [firstcommitstudent, setFirstCommitStudent] = useState<
    {
      outTimeT: string | number | readonly string[] | undefined;
      id: string;
      check: string;
      comment: string;
      author: string;
    }[]
  >([]);

  const { data: session } = useSession();

  const [successModal, setSuccessModal] = useState(false);

  // 처음 로딩
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/nightAT/page")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          // 학생 번호 기준 숫자 정렬
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
          const today = new Date();
          const isToday = todayDate.toDateString() === today.toDateString();

          // 날짜 보기 좋게
          let formattedDate: string = "";
          if (isToday) {
            formattedDate = todayDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          }
          const todayDay = new Date().getDay();
          const initialFirstCommitStudent = sortedData.map((student) => {
            let defaultTime = "";
            switch (todayDay) {
              case 1:
                defaultTime = student.monTime || "0";
                break;
              case 2:
                defaultTime = student.tueTime || "0";
                break;
              case 3:
                defaultTime = student.wedTime || "0";
                break;
              case 4:
                defaultTime = student.thuTime || "0";
                break;
              case 5:
                defaultTime = student.friTime || "0";
                break;
              default:
                defaultTime = "0";
            }

            const defaultCheck = defaultTime === "0" ? "0" : "1";

            return {
              id: student.id,
              updatedAt: formattedDate,
              name: student.name,
              class: student.class,
              grade: student.grade,
              studentnumber: student.studentnumber,
              check: defaultCheck,
              outTimeT: defaultTime || "",
              outTimeST: defaultTime || "",
              comment:
                (student.check === "1" ? "" : student.comment) ||
                (defaultCheck === "1" ? "" : "요일 미출석 학생"),
              author: session?.user?.name || "",
              createdAt: student.createdAt,
              secondNumber: student.secondNumber || "",

              monTime: student.monTime || "", // Add this line
              tueTime: student.tueTime || "", // Add this line
              wedTime: student.wedTime || "", // Add this line
              thuTime: student.thuTime || "", // Add this line
              friTime: student.friTime || "", // Add this line
            };
          });
          const filteredData = initialFirstCommitStudent.filter(
            (student) =>
              student.grade === session?.user?.grade &&
              student.class === session?.user?.class
          );
          setFirstCommitStudent(filteredData);
        } else {
          console.error(data);
        }
        setIsLoading(false);
      });
  }, [session]);

  // id를 기반으로 comment를 업데이트
  const handleCommitChange = (id: string, field: string, value: string) => {
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  // id를 기반으로 시간 값을 업데이트
  const handleTimeChange = (id: string, field: string, value: string) => {
    setFirstCommitStudent((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
    console.log(firstcommitstudent);
  };

  // id를 기반으로 체크박스 상태 업데이트
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
              // 출석(체크박스 이름이 "y")인 경우 comment를 빈 문자열로 설정
              comment: event.target.name === "y" ? "" : student.comment,
            }
          : student
      )
    );
  };

  const handlePatch = () => {
    setIsLoading(true);
    axios
      .post(
        "/api/post/nightAT/page",
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
          setSuccessModalTimer();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        toast("예상치 못한 오류가 발생하였습니다");
      });

    localStorage.setItem("compareAT2", JSON.stringify(firstcommitstudent));
  };

  const setSuccessModalTimer = () => {
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false);
    }, 2500);
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
                outTimeT: updatedStudent.outTimeT,
              }
            : student;
        } else {
          return updatedStudent
            ? {
                ...student,
                check: updatedStudent.check,
                comment: updatedStudent.comment,
                outTimeT: updatedStudent.outTimeT,
              }
            : student;
        }
      })
    );
  };

  const validation = useMemo(() => {
    const errorCounts: { [msg: string]: number } = {};

    // 각 학생마다 한 가지 오류만 기록
    for (const student of firstcommitstudent) {
      let errorMessageForStudent: string | null = null;
      if (!["0", "1", "2"].includes(student.check)) {
        errorMessageForStudent = "출석 여부가 선택되지 않았습니다.";
      } else if (student.check === "1") {
        if (!student.outTimeT) {
          errorMessageForStudent = "출석 퇴장 시간이 입력되지 않았습니다.";
        }
      } else if (student.check === "0" || student.check === "2") {
        if (!student.outTimeT && !student.comment) {
          errorMessageForStudent =
            "퇴장 시간이 입력되지 않았으며, 미출석 사유도 입력되지 않았습니다.";
        } else if (!student.outTimeT) {
          errorMessageForStudent = "퇴장 시간이 입력되지 않았습니다.";
        } else if (!student.comment) {
          errorMessageForStudent = "미출석 사유가 입력되지 않았습니다.";
        }
      }

      if (errorMessageForStudent) {
        errorCounts[errorMessageForStudent] =
          (errorCounts[errorMessageForStudent] || 0) + 1;
      }
    }

    // 전체 학생 중 가장 많이 발생한 오류 메시지 선택
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

  const countAbsentStudentsNO = () => {
    return firstcommitstudent.filter((student) => student.check === "0").length;
  };
  const countAbsentStudentsOK = () => {
    return firstcommitstudent.filter((student) => student.check === "1").length;
  };

  if (isLoading) {
    return <div className="loading">잠시만 기다려주세요...</div>;
  }

  if (attendance.length === 0) {
    return (
      <>
        <div>이런! 등록하신 반 학생들의 정보가 없어요</div>
        <button onClick={() => setModalOpen(true)}>등록하기</button>
        {modalOpen ? (
          <PlusStudentModal
            props={setAttendance}
            closeModal={() => setModalOpen(false)}
          />
        ) : null}
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
              <SuccessModal name={"완료!"} content={"출석이 완료되었습니다"} />
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
              // attendance의 id를 이용해 firstcommitstudent에서 해당 학생을 찾습니다.
              const student = firstcommitstudent.find((s) => s.id === data.id);

              return (
                <div
                  style={{
                    backgroundColor: `${
                      student?.check === "0"
                        ? "#FFE8E8"
                        : student?.check === "1"
                        ? "#E8E8FF"
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
                      alignItems: student?.check === "0" ? "normal" : "center",
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
                      {student?.check === "0" ? (
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
                            value={student?.comment || ""}
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
                      {student?.check === "1" ? (
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

                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <div style={{ marginRight: "20px" }}>
                          <input
                            className="time-input"
                            type="time"
                            value={student?.outTimeT || ""}
                            onChange={(e) =>
                              handleTimeChange(
                                data.id,
                                "outTimeT",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <input
                          type="checkbox"
                          className="no-check"
                          name="n"
                          checked={student?.check === "0"}
                          onChange={(e) => handleCheckboxChange(data.id, e)}
                        />
                        <input
                          type="checkbox"
                          className="yes-check"
                          name="y"
                          checked={student?.check === "1"}
                          onChange={(e) => handleCheckboxChange(data.id, e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {modalOpen ? (
            <PlusStudentModal
              props={setAttendance}
              closeModal={() => setModalOpen(false)}
            />
          ) : null}
          <button
            className="ok-button"
            disabled={validation.disabled}
            onClick={handlePatch}
          >
            출석 정보 저장
          </button>
        </div>
      </>
    );
  }
}
