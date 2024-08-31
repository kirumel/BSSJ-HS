"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "./style.css";

import PlusStudentModal from "./plusStudentModal";
import SuccessModal from "./successModal";

import { Slide, ToastContainer, toast } from "react-toastify";
import "../choiceATteacher/style.css";
import axios from "axios";

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

export default function Page() {
  //학생추가 모달창 스테이트
  const [modalOpen, setModalOpen] = useState(false);

  //학생 리스트 저장 스테이트
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  //로딩 부분
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [firstcommitstudent, setFirstCommitStudent] = useState<
    {
      id: string;
      check: string;
      comment: string;
      author: string;
    }[]
  >([]);

  const { data: session } = useSession();

  const [successModal, setSuccessModal] = useState(false);

  //처음 로딩
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/attendance")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          // 숫자정렬
          const sortedData = data.sort(
            (a, b) => parseInt(a.studentnumber) - parseInt(b.studentnumber)
          );
          setAttendance(sortedData);
          const todayDate = new Date();
          const today = new Date();
          const isToday = todayDate.toDateString() === today.toDateString();

          //날자 보기좋게
          let formattedDate: string;
          if (isToday) {
            formattedDate = todayDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          }

          const initialFirstCommitStudent = sortedData.map((student) => ({
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

  const handleCommitChange = (index: number, field: string, value: string) => {
    const newData = [...firstcommitstudent];
    newData[index] = { ...newData[index], [field]: value };
    setFirstCommitStudent(newData);
  };

  const handleCheckboxChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = [...firstcommitstudent];
    newData[index] = {
      ...newData[index],
      check: event.target.name === "n" ? "0" : "1",
    };
    setFirstCommitStudent(newData);
  };
  const handlePatch = () => {
    axios
      .patch(
        "/api/post/attendance",
        { firstcommitstudent },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 202) {
          toast(response.data);
        } else {
          setSuccessModalTimer();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    localStorage.setItem("compareAT", JSON.stringify(firstcommitstudent));
  };

  const setSuccessModalTimer = () => {
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false);
    }, 2500);
  };

  const countAbsentStudentsNO = () => {
    return firstcommitstudent.filter((student) => student.check === "0").length;
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
            {successModal ? <SuccessModal props={successModal} /> : null}
          </div>
          <div className="attendance-top-container-display">
            <div className="attendance-top-in1">
              <p>총 인원: {attendance.length}</p>
              <p>미출석: {countAbsentStudentsNO()}</p>
              <p>출석: {countAbsentStudentsOK()}</p>
            </div>
            <button
              className="plus-attendance-button"
              onClick={() => setModalOpen(true)}
            >
              학생 추가
            </button>
          </div>
          <div className="attendance-container">
            {attendance.map((data, i) => (
              <div
                style={{
                  backgroundColor: `${
                    firstcommitstudent[i]?.check === "0"
                      ? "#FFE8E8"
                      : firstcommitstudent[i]?.check === "1"
                      ? "#E8E8FF"
                      : "white"
                  }`,
                }}
                className="attendance-student"
                key={i}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: `${
                      firstcommitstudent[i]?.check == "0" ? "normal" : "center"
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
                    {firstcommitstudent[i]?.check === "0" ? (
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
                          value={firstcommitstudent[i]?.comment || ""}
                          onChange={(e) =>
                            handleCommitChange(i, "comment", e.target.value)
                          }
                        />
                      </div>
                    ) : null}
                    {firstcommitstudent[i]?.check === "1" ? (
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
                      <input
                        type="checkbox"
                        className="no-check"
                        name="n"
                        checked={firstcommitstudent[i]?.check === "0"}
                        onChange={(e) => handleCheckboxChange(i, e)}
                      />
                      <input
                        type="checkbox"
                        className="yes-check"
                        name="y"
                        checked={firstcommitstudent[i]?.check === "1"}
                        onChange={(e) => handleCheckboxChange(i, e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {modalOpen ? (
            <PlusStudentModal
              props={setAttendance}
              closeModal={() => setModalOpen(false)}
            />
          ) : null}
          <button className="ok-button" onClick={handlePatch}>
            출석 정보 저장
          </button>
        </div>
      </>
    );
  }
}
