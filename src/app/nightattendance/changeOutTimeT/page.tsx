"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "../style.css";

import { Slide, ToastContainer, toast } from "react-toastify";
import "../../choiceATteacher/style.css";
import axios from "axios";
import SuccessModal from "../successModal";

interface Attendance {
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
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [bulkTime, setBulkTime] = useState<string>("");
  const { data: session } = useSession();
  const [successModal, setSuccessModal] = useState(false);
  const [firstcommitstudent, setFirstCommitStudent] = useState<
    {
      outTimeAT: string;
      outTimeT: string;
      id: string;
      check: string;
      comment: string;
      author: string;
    }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/nightAT/nightAT")
      .then((response) => response.json())
      .then((data: Attendance[]) => {
        if (Array.isArray(data)) {
          const sortedData = data.sort(
            (a, b) => parseInt(a.studentnumber) - parseInt(b.studentnumber)
          );
          const filteredData = sortedData.filter(
            (student) =>
              student.grade === session?.user?.grade &&
              student.class === session?.user?.class
          );
          setAttendance(filteredData);
          setFirstCommitStudent(
            filteredData.map((student) => ({
              id: student.id,
              outTimeAT: student.outTimeAT || "",
              outTimeT: student.outTimeAT || "",
              check: "",
              comment: "",
              author: session?.user?.name || "",
            }))
          );
        }
        setIsLoading(false);
      });
  }, [session]);
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(attendance.map((student) => student.id)));
    }
    setAllSelected(!allSelected);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newData = [...firstcommitstudent];
    newData[index] = { ...newData[index], outTimeT: value };
    setFirstCommitStudent(newData);
  };

  const handleBulkTimeChange = (value: string) => {
    setBulkTime(value);
    const newData = [...firstcommitstudent];
    newData.forEach((student, index) => {
      if (selectedStudents.has(student.id)) {
        newData[index] = { ...student, outTimeT: value };
      }
    });
    setFirstCommitStudent(newData);
  };

  const handleSelectStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handlePatch = () => {
    setIsLoading(true);
    axios
      .patch(
        "/api/post/nightAT/fetchTime",
        { firstcommitstudent, grade: session?.user?.grade },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        setIsLoading(false);
        response.status === 202 ? toast(response.data) : setSuccessModalTimer();
      })
      .catch(() => {
        setIsLoading(false);
        toast("예상치 못한 오류가 발생하였습니다");
      });
  };

  const setSuccessModalTimer = () => {
    setSuccessModal(true);
    setTimeout(() => setSuccessModal(false), 2500);
  };

  if (isLoading) return <div className="loading">잠시만 기다려주세요...</div>;
  if (attendance.length === 0)
    return <div>이런! 등록하신 반 학생들의 정보가 없어요</div>;
  <div className="bulk-time-container">
    <input
      type="time"
      value={bulkTime}
      onChange={(e) => handleBulkTimeChange(e.target.value)}
    />
    <button onClick={() => handleBulkTimeChange(bulkTime)}>
      선택한 학생들에 적용
    </button>
  </div>;
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        closeButton={false}
      />
      <div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => setIsModalOpen(false)}
                style={{
                  display: "flex",
                  justifyContent: "right",
                  cursor: "pointer",
                }}
              >
                &times;
              </span>
              <div>시간 선택</div>
              <div>
                <input
                  type="time"
                  className="time-input"
                  value={bulkTime}
                  onChange={(e) => setBulkTime(e.target.value)}
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    handleBulkTimeChange(bulkTime);
                    setIsModalOpen(false);
                  }}
                  style={{ width: "100%", padding: "5px" }}
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="right-left-margin">
        {successModal && <SuccessModal props={successModal} />}
        <div className="attendance-top-container-display">
          <button
            className="plus-attendance-button"
            onClick={() => setIsModalOpen(true)}
          >
            선택 메뉴
          </button>
          <button className="plus-attendance-button" onClick={handleSelectAll}>
            {allSelected ? "전체 해제" : "전체 선택"}
          </button>
        </div>
        <div className="attendance-container">
          {attendance.map((data, i) => (
            <div
              className="attendance-student"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              key={data.id}
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
                <input
                  type="checkbox"
                  checked={selectedStudents.has(data.id)}
                  onChange={() => handleSelectStudent(data.id)}
                />
                <input
                  type="time"
                  className="time-input"
                  value={firstcommitstudent[i]?.outTimeT || ""}
                  onChange={(e) => handleTimeChange(i, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="ok-button" onClick={handlePatch}>
          출석 정보 저장
        </button>
      </div>
    </>
  );
}
