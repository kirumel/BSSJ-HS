"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import "../attendance/style.css";

import SuccessModal from "../successModal/page";
import "./style.css";
import axios from "axios";
import SelectStudentModal from "./selectStudentModal";
import GenerateModal from "./generaterModal/page";
import GenerateModal2 from "./generaterModal2/page";
import GenerateModalN from "./generaterModalN/page";

interface Attendance {
  secondNumber: string;
  outTimeAT: string;
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
const formattedDate = todayDate.toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function Page() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [originalAttendance, setOriginalAttendance] = useState<Attendance[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firstcommitstudent, setFirstCommitStudent] = useState<Attendance[]>(
    []
  );
  const { data: session } = useSession();
  const [successModal, setSuccessModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [sortState, setSortstate] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState<Attendance[]>([]);
  const [modal1, setmodal1] = useState(false);
  const [modal2, setmodal2] = useState(false);
  const [modal3, setmodal3] = useState(false);
  const [passN, setPassN] = useState(false);
  const [time, settime] = useState(false);

  const [timeY, settimeY] = useState(false);

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

  const classList = getClassList();

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
  useEffect(() => {
    if (timeY) {
      handlePatch(); // timeY가 true일 때만 handlePatch 실행
    }
  }, [timeY]);

  const handelTmodal = (state: boolean) => {
    if (state === true) {
      settime(false);
      settimeY(true); // 상태 변경
    } else {
      settimeY(false);
      settime(false);
    }
  };
  const handlePatch = async () => {
    try {
      const todayDate1 = new Date();
      todayDate1.setDate(todayDate1.getDate() - 1);
      const formattedDate1 = todayDate1.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const findTime = firstcommitstudent.filter((a) => a.outTimeST === "");
      if (findTime.length !== 0 && timeY == false) {
        settime(true);
      } else {
        if (timeY == true || findTime.length === 0) {
          setmodal1(true);
          const generateY = await axios
            .get("/api/post/nightAT/generateY", {
              params: { grade: 1, date: formattedDate1 },
            }) // params로 전달
            .then(async (response) => {
              const responseBody = response;
              setTimeout(async () => {
                if (responseBody.status === 203) {
                  setmodal1(false);
                  setPassN(true);
                  setTimeout(async () => {
                    setPassN(false);
                    setmodal2(false);
                    setmodal3(true);
                    const response3 = await axios
                      .post(
                        "/api/post/nightAT/fetchTime2",
                        { firstcommitstudent },
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      )
                      .then((response) => {
                        if (response.status === 200) {
                          setSuccessModalTimer();
                        }
                      });
                  }, 2000);
                } else if (responseBody.status === 200) {
                  setmodal1(false);
                  setmodal2(true);

                  const payload = {
                    date: formattedDate1,
                    grade: Number(1),
                  };
                  const pdfResponse = await axios.post(
                    "/api/post/nightAT/PDF",
                    {
                      payload,
                    }
                  );
                  if (pdfResponse.status !== 200) {
                    alert("PDF 파일 생성 실패");
                    return;
                  }

                  const xlsxResponse = await axios.post(
                    "/api/post/nightAT/xlsx",
                    {
                      payload,
                    }
                  );
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
                  setTimeout(async () => {
                    setPassN(false);
                    setmodal2(false);
                    setmodal3(true);
                    const response3 = await axios
                      .post(
                        "/api/post/nightAT/fetchTime2",
                        { firstcommitstudent },
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      )
                      .then((response) => {
                        if (response.status === 200) {
                          setSuccessModalTimer();
                        }
                      });
                  }, 2000);
                }
              }, 2000);
              settimeY(false);
              settime(false);
            });
        } else {
          null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setSuccessModalTimer = () => {
    setTimeout(() => {
      setmodal3(false);
      setSuccessModal(true);
    }, 3000);
    setTimeout(() => {
      setSuccessModal(false);
    }, 10000);
  };

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

  function convertTo12Hour(time24: string) {
    if (!time24) return "설정된 시간 없음";
    let [hours, minutes] = time24.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  const validation = useMemo(() => {
    const errorCounts: { [msg: string]: number } = {};
    for (const student of firstcommitstudent) {
      let errorMessageForStudent: string | null = null;

      if (!["0", "1", "2"].includes(student.check)) {
        errorMessageForStudent = "출석 여부가 선택되지 않았습니다.";
      } else if (student.check === "1") {
        // 출석인 경우: 출석 퇴장 시간이 없으면 에러 발생
        if (!student.outTimeST) {
          errorMessageForStudent = "출석 퇴장 시간이 입력되지 않았습니다.";
        }
      } else if (student.check === "0" || student.check === "2") {
        // 미출석인 경우: 코멘트가 없으면 에러 발생 (trim으로 공백만 있는 경우도 체크)
        const commentEmpty = !student.comment || student.comment.trim() === "";
        if (commentEmpty && !student.outTimeT) {
          errorMessageForStudent =
            "퇴장 시간이 입력되지 않았으며, 미출석 사유도 입력되지 않았습니다.";
        } else if (commentEmpty) {
          errorMessageForStudent = "미출석 사유가 입력되지 않았습니다.";
        } else if (!student.outTimeST) {
          errorMessageForStudent = "퇴장 시간이 입력되지 않았습니다.";
        }
      }

      if (errorMessageForStudent) {
        errorCounts[errorMessageForStudent] =
          (errorCounts[errorMessageForStudent] || 0) + 1;
      }
    }

    // 가장 많이 발생한 오류 메시지 산출
    let mostCommonError = "";
    let maxCount = 0;
    for (const [msg, count] of Object.entries(errorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonError = msg;
      }
    }
    let errorMessage = mostCommonError;
    if (maxCount > 1) {
      errorMessage = `다수의 ${mostCommonError}`;
    }

    const disabled = Object.keys(errorCounts).some(
      (msg) => msg.includes("출석 여부") || msg.includes("미출석 사유")
    );

    if (errorMessage) {
      return { error: errorMessage, disabled };
    }
    return { error: "", disabled: false };
  }, [firstcommitstudent]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/nightAT/page")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          // 기본 정렬: 반과 번호 기준
          const updatedFinalData = data.map((student) => {
            const isUpdatedToday = student.updatedAt === formattedDate;

            return {
              ...student,
              check: isUpdatedToday ? student.check : "", // 오늘 날짜가 아니면 초기화
              comment: isUpdatedToday ? student.comment : "", // 오늘 날짜가 아니면 초기화
            };
          });
          const sortedData = updatedFinalData.sort((a, b) => {
            if (a.class !== b.class) {
              return a.class - b.class;
            }
            return parseInt(a.studentnumber) - parseInt(b.studentnumber);
          });
          const sortedData1 = sortedData.filter(
            (student) => student.grade === 1
          );
          const presentStudents = sortedData1.filter(
            (student) => student.check !== "0"
          );
          const absentStudents = sortedData1.filter(
            (student) => student.check === "0"
          );
          const finalSortedData = [...presentStudents, ...absentStudents];
          console.log(absentStudents);
          // 원래 순서를 저장

          const initialFirstCommitStudent = finalSortedData.map((student) => ({
            id: student.id,
            updatedAt: formattedDate,
            name: student.name,
            class: student.class,
            grade: student.grade,
            studentnumber: student.studentnumber,
            check: student.check === "0" ? "2" : "",
            outTimeT: student.outTimeT || student.outTimeAT || "",
            outTimeST: student.outTimeT || student.outTimeAT || "",
            outTimeAT: student.outTimeAT || "", // Add this line
            comment: student.comment || "",
            author: session?.user?.name || "",
            createdAt: student.createdAt,
            secondNumber: student.secondNumber || "",
          }));
          console.log(initialFirstCommitStudent);
          setAttendance(initialFirstCommitStudent);
          setOriginalAttendance(initialFirstCommitStudent);
          setFirstCommitStudent(initialFirstCommitStudent);
        } else {
          console.error(data);
        }
        setIsLoading(false);
      });
  }, [session]);

  useEffect(() => {
    setFilteredStudents(getFilteredStudents());
  }, [attendance, selectedClass]);

  const handleSortChange = () => {
    if (sortState === true) {
      // 첫 클릭: secondNumber 기준 정렬 (undefined인 경우 Infinity 처리)
      setSortstate(false);
      const sortedData = [...attendance].sort((a, b) => {
        const aNum = a.secondNumber ? parseInt(a.secondNumber) : Infinity;
        const bNum = b.secondNumber ? parseInt(b.secondNumber) : Infinity;
        return aNum - bNum;
      });
      setAttendance(sortedData);
      setFilteredStudents(getFilteredStudents());
    } else {
      // 두 번째 클릭: 원래 순서(반, 번호 기준)로 복원
      setSortstate(true);
      setAttendance([...originalAttendance]);
      setFilteredStudents(getFilteredStudents());
    }
  };

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
        {modal1 && (
          <GenerateModal
            name={"미생성 파일을 찾는 중"}
            content={"잠시만 기다려주세요"}
          />
        )}
        {modal2 && (
          <GenerateModal2
            name={"미생성 파일을 찾았습니다!"}
            content={"어제의 출석부를 생성 중입니다"}
          />
        )}
        {modal3 && (
          <GenerateModal2
            name={"출석을 저장 중입니다"}
            content={"잠시만 기다려주세요"}
          />
        )}
        {passN && (
          <GenerateModal
            name={"이미 파일이 생성되었거나"}
            content={"어제의 출석이 완료되지 않았습니다"}
          />
        )}
        {time && (
          <GenerateModalN
            name={"이런! 1,2차 모두 "}
            content={"퇴장시간이 기록되지 않았습니다"}
            setTimeY={handelTmodal}
          />
        )}

        {successModal && (
          <SuccessModal name={"완료!"} content={"출석이 완료되었습니다"} />
        )}
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
            {sortState && (
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
            )}

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
              marginTop: "3px",
            }}
          >
            {validation.error}
          </p>
        )}
        <button
          style={{
            marginTop: "10px",
          }}
          className="class-select"
          onClick={handleSortChange}
        >
          배열변경
        </button>
        <div className="attendance-container">
          {filteredStudents.map((data, i) => {
            const studentCommit = firstcommitstudent.find(
              (student) => student.id === data.id
            ) || {
              check: "",
              comment: "",
              outTimeST: "",
              outTimeT: "",
            };
            if (studentCommit?.check === "2") {
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
              return (
                <div key={data.id}>
                  <div
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
                          {data.studentnumber}번/ 자리번호 :
                          {data.secondNumber
                            ? `${data.secondNumber}번`
                            : "설정 안 됨"}
                        </p>
                        <p className="attendance-student-number">
                          기본:{convertTo12Hour(data.outTimeT)}
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
                          <div>
                            <h5>
                              미출석
                              <br />
                              이유 : {data?.comment}
                            </h5>
                          </div>
                        ) : (
                          <div
                            style={{ display: "flex", justifyContent: "right" }}
                          >
                            <div style={{ marginRight: "20px" }}>
                              <input
                                style={{
                                  backgroundColor:
                                    studentCommit.outTimeST ===
                                    (studentCommit.outTimeT || "")
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
                  {sortState == true &&
                    (i === filteredStudents.length - 1 ||
                      filteredStudents[i + 1].class !== data.class) && (
                      <div className="class-line">
                        <div
                          className="line"
                          style={{
                            width: "90%",
                            backgroundColor: "rgb(138, 156, 255)",
                            height: "1px",
                          }}
                        ></div>
                        <div>{data.class}반</div>
                      </div>
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
}
