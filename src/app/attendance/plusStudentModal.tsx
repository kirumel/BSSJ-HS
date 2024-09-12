"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Attendance {
  name: string;
  content: string;
  check: string;
  author: string;
  grade: string;
  class: string;
  studentnumber: string;
}

export default function PlusStudentModal(props: {
  props: (attendance: any) => void;
  closeModal: () => void;
}) {
  const { closeModal, props: updateAttendance } = props;
  const { data: session } = useSession();
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const [conformselectedCount, setConformSelectedCount] = useState<number>(1);
  const [studentData, setStudentData] = useState<
    { name: string; grade: string; clss: string; studentnumber: string }[]
  >([]);

  console.log(studentData);

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConformSelectedCount(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    fetch("/api/post/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentData }),
    })
      .then((response) => response.json())
      .then((data) => {
        closeModal();
        fetch("/api/post/attendance")
          .then((response) => response.json())
          .then((data: Attendance[]) => {
            updateAttendance(data);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleconformcount = () => {
    if (isNaN(conformselectedCount)) {
      setSelectedCount(1);
    } else {
      setSelectedCount(conformselectedCount);
    }
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    let newData = [...studentData];

    newData[index] = {
      ...newData[index],
      [field]: value,
      grade: session?.user?.grade,
      clss: session?.user?.class,
    };

    setStudentData(newData);
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content" style={{ margin: "30px" }}>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <p>인원을 입력해주세요</p>
          <input
            className="plus-student-input"
            type="text"
            placeholder="인원"
            onChange={handleSelectChange}
          />
          <button className="plus-student-button" onClick={handleconformcount}>
            인원 추가
          </button>
          <div className="scroll-container-attendance">
            {[...Array(selectedCount)].map((_, index) => (
              <div
                key={index}
                className="input-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <input
                  className="plus-student-input"
                  type="text"
                  placeholder="이름"
                  maxLength={5}
                  value={studentData[index]?.name || ""}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <input
                  className="plus-student-input"
                  type="text"
                  value={studentData[index]?.studentnumber || ""}
                  placeholder="번호"
                  maxLength={1}
                  onChange={(e) =>
                    handleInputChange(index, "studentnumber", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} className="ok-button">
            확인
          </button>
        </div>
      </div>
    </>
  );
}
