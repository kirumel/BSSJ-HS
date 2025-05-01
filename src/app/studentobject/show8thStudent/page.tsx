"use client";
import axios from "axios";
import "../addStudentObject/style.css";
import { useEffect, useState } from "react";
import SuccessModal from "../../successModal/page";
import Loading from "@/app/loading/page";

// 모달 컴포넌트 (공통)
const Modal = ({ isOpen, onClose, onConfirm, title, modalContent }: any) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={onClose}
          style={{
            display: "flex",
            justifyContent: "right",
            cursor: "pointer",
          }}
        >
          &times;
        </span>
        <h3>{title}</h3>
        {modalContent}
        <div style={{ marginTop: "10px" }}>
          <button onClick={onClose} style={{ marginRight: "10px" }}>
            취소
          </button>
          <button onClick={onConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [copyDB, setCopyDB] = useState("attendanceObject");
  const [isArray, setIsArray] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [successModal, setsuccessModal] = useState(false);

  // 추가: 요일별 시간 수정 모달 상태 및 선택 학생 정보
  const [isEditTimeModalOpen, setIsEditTimeModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/post/attendance");

        const sortedData = response.data.sort((a: any, b: any) => {
          if (a.grade !== b.grade) {
            return a.grade - b.grade;
          } else if (a.class !== b.class) {
            return a.class - b.class;
          } else {
            return parseInt(a.studentnumber) - parseInt(b.studentnumber);
          }
        });

        setStudents(sortedData);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getClassList = () => {
    const classSet = new Set(students.map((student) => student.class));
    return Array.from(classSet).sort();
  };

  const getFilteredStudents = () => {
    if (!selectedGrade && !selectedClass) {
      return students;
    }
    if (selectedGrade && !selectedClass) {
      return students.filter((student) => student.grade == selectedGrade);
    }
    if (!selectedGrade && selectedClass) {
      return students.filter((student) => student.class == selectedClass);
    }
    // 학년과 반 모두 선택된 경우
    return students.filter(
      (student) =>
        student.grade == selectedGrade && student.class == selectedClass
    );
  };

  const classList = getClassList();
  const filteredStudents = getFilteredStudents();

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.has(studentId)
        ? newSelected.delete(studentId)
        : newSelected.add(studentId);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const allStudentIds = new Set(students.map((student) => student.id));
    setSelectedStudents(
      selectedStudents.size === students.length ? new Set() : allStudentIds
    );
  };

  const deleteSelectedStudents = async () => {
    try {
      await axios
        .post("/api/post/8thdeleteStudent", {
          studentIds: Array.from(selectedStudents),
        })
        .then((response) => {
          if (response.status === 200) {
            setStudents(
              students.filter((student) => !selectedStudents.has(student.id))
            );
            alert("삭제완료");
          } else {
            alert("오류발생");
          }
        });
      setSelectedStudents(new Set());
    } catch (error) {
      console.error("Failed to delete selected students:", error);
    }
  };

  const handleSecondNumberChange = (event: any, id: string) => {
    const secondNumber = event.target.value;
    setStudents((prevstate) =>
      prevstate.map((student) =>
        student.id === id ? { ...student, secondNumber } : student
      )
    );
  };

  const deleteStudent = async (studentId: string) => {
    try {
      await axios
        .post("/api/post/8thdeleteStudent", {
          studentIds: [studentId], // 하나의 학생만 삭제
        })
        .then((response) => {
          if (response.status === 200) {
            setStudents(students.filter((student) => student.id !== studentId));
            alert("삭제완료");
          } else {
            alert("오류발생");
          }
        });
      setStudentToDelete(null); // 삭제 후 모달 닫기
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const copySelectedStudentsToDB = async () => {
    try {
      const selectedData = students.filter((student) =>
        selectedStudents.has(student.id)
      );
      await axios
        .post("/api/post/copyMultipleToDB", {
          students: selectedData,
          targetDB: copyDB,
        })
        .then((response) => {
          if (response.status === 200) {
            alert(`선택된 학생들이 ${copyDB} DB로 복사되었습니다.`);
          }
        });
      setSelectedStudents(new Set());
    } catch (error) {
      console.error("Failed to copy selected students:", error);
    }
  };

  const copyStudentToDB = async (studentId: string) => {
    try {
      const studentData = students.find((student) => student.id === studentId);
      if (studentData) {
        await axios
          .post("/api/post/copyMultipleToDB", {
            students: [studentData],
            targetDB: copyDB,
          })
          .then((response) => {
            if (response.status === 200) {
              alert(`선택된 학생이 ${copyDB} DB로 복사되었습니다.`);
            }
          });
      }
      setStudentToDelete(null);
    } catch (error) {
      console.error("Failed to copy student:", error);
    }
  };
  const handleArrayChange = (): void => {
    if (isArray === true) {
      setIsArray(false);
      const newArray = [...students].sort((a, b) => {
        if (a.class === b.class) {
          return parseInt(a.studentnumber) - parseInt(b.studentnumber);
        }
        return a.class - b.class;
      });
      setStudents(newArray);
    } else {
      setIsArray(true);
      const newArray = [...students].sort((a, b) => {
        const aNum = a.secondNumber ? parseInt(a.secondNumber) : Infinity;
        const bNum = b.secondNumber ? parseInt(b.secondNumber) : Infinity;
        return aNum - bNum;
      });
      setStudents(newArray);
    }
  };

  const handleSort = async () => {
    setsuccessModal(false);
    setLoading(true);
    await axios.patch("/api/post/sort8th", students).then((response) => {
      if (response.status === 200) {
        setLoading(false);
        setsuccessModal(true);
      } else {
        setLoading(false);
        alert("오류발생");
      }
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {successModal && (
        <SuccessModal
          props={{
            name: "성공!",
            content: "야자 학생 순서 정렬완료",
          }}
        />
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedStudents.size > 0) {
            deleteSelectedStudents();
          } else if (studentToDelete) {
            deleteStudent(studentToDelete);
          }
        }}
        title="학생 삭제 확인"
        modalContent={<p>정말 이 학생을 삭제하시겠습니까?</p>}
      />

      {/* 복사 모달 */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onConfirm={() => {
          if (selectedStudents.size > 0) {
            copySelectedStudentsToDB();
          } else if (studentToDelete) {
            copyStudentToDB(studentToDelete);
          }
        }}
        title="복사할 DB 선택"
        modalContent={
          <>
            <p>복사할 위치 선택해주세요</p>
            <select
              value={copyDB}
              onChange={(e) => setCopyDB(e.target.value)}
              style={{ width: "100%", padding: "5px", marginTop: "10px" }}
            >
              <option value="attendanceObject">8교시 학생 목록</option>
              <option value="mainAttendanceObject">모든 학생 목록</option>
            </select>
          </>
        }
      />

      {/* 요일별 시간 수정 모달 */}
      <Modal
        isOpen={isEditTimeModalOpen}
        onClose={() => setIsEditTimeModalOpen(false)}
        onConfirm={async () => {
          if (studentToEdit) {
            try {
              // 수정된 학생 데이터를 서버에 전송하는 API 요청
              const response = await axios.patch(
                `/api/post/updateStudent/${studentToEdit.id}`,
                studentToEdit
              );
              if (response.status === 200) {
                // 서버 업데이트 성공 시, 로컬 상태도 업데이트
                setStudents((prev) =>
                  prev.map((s) =>
                    s.id === studentToEdit.id ? studentToEdit : s
                  )
                );
                alert("수정 완료");
              } else {
                alert("업데이트 실패");
              }
            } catch (error) {
              console.error("수정 요청 실패:", error);
              alert("업데이트 중 오류가 발생했습니다.");
            } finally {
              setIsEditTimeModalOpen(false);
            }
          }
        }}
        title="요일별 시간 수정"
        modalContent={
          studentToEdit && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {["monTime", "tueTime", "wedTime", "thuTime", "friTime"].map(
                (day) => {
                  const dayLabels: Record<string, string> = {
                    monTime: "월요일",
                    tueTime: "화요일",
                    wedTime: "수요일",
                    thuTime: "목요일",
                    friTime: "금요일",
                  };

                  return (
                    <div key={day}>
                      <label>
                        {dayLabels[day]}
                        <input
                          type="text"
                          value={studentToEdit[day] || ""}
                          onChange={(e) =>
                            setStudentToEdit({
                              ...studentToEdit,
                              [day]: e.target.value,
                            })
                          }
                          style={{
                            marginLeft: "10px",
                            padding: "5px",
                            width: "80%",
                          }}
                        />
                      </label>
                    </div>
                  );
                }
              )}
            </div>
          )
        }
      />

      {/* 상단 컨트롤 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <input
            className="select-button"
            type="checkbox"
            checked={selectedStudents.size === students.length}
            onChange={handleSelectAll}
            style={{ marginRight: "10px" }}
          />
          <span>전체 선택</span>
        </div>
        <div>
          <button
            className="class-select"
            style={{ marginRight: "10px" }}
            onClick={handleArrayChange}
          >
            배열변경
          </button>
          <label>학년: </label>
          <select
            className="class-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">전체</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>
          <label style={{ marginLeft: "10px" }}>반: </label>
          <select
            className="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">전체</option>
            {classList.map((cls, index) => (
              <option key={index} value={cls}>
                {cls}반
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 학생 목록 */}
      <div
        className="attendance-container"
        style={{ height: "60vh", width: "100%" }}
      >
        {students.length === 0 ? (
          <p>등록된 학생 데이터가 없습니다.</p>
        ) : (
          filteredStudents.map((data) => (
            <div key={data.id} className="attendance-student">
              <div className="admin-student-display">
                <div className="attendance-student-title" style={{ margin: 0 }}>
                  <p className="attendance-student-name">{data.name}</p>
                  <p
                    className="attendance-student-gradeandclass"
                    style={{ fontSize: "10px" }}
                  >
                    {data.grade}학년 {data.class}반
                  </p>
                  <p
                    className="attendance-student-gradeandclass"
                    style={{ fontSize: "10px" }}
                  >
                    {data.studentnumber}번
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input
                    className="select-button"
                    type="checkbox"
                    checked={selectedStudents.has(data.id)}
                    onChange={() => handleSelectStudent(data.id)}
                    style={{ marginRight: "10px" }}
                  />
                  <input
                    type="number"
                    className="text-input"
                    style={{
                      fontSize: "10px",
                      padding: "5px",
                      width: "20vw",
                      marginRight: "10px",
                    }}
                    value={data.secondNumber}
                    onChange={(e) => handleSecondNumberChange(e, data.id)}
                  />
                  <button
                    className="delete-button"
                    onClick={() => {
                      setStudentToDelete(data.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    삭제
                  </button>

                  {/* 추가: 요일별 시간 수정 버튼 */}
                </div>
              </div>
              <div className="editTime">
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "4px",
                    color: "#555",
                  }}
                >
                  <div
                    style={{
                      gap: "3px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "3px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {data.monTime && <div>월 {data.monTime}</div>}
                      {data.tueTime && <div>화 {data.tueTime}</div>}
                      {data.wedTime && <div>수 {data.wedTime}</div>}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "3px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {data.thuTime && <div>목 {data.thuTime}</div>}
                      {data.friTime && <div>금 {data.friTime}</div>}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className="copy-button"
                    onClick={() => {
                      setStudentToEdit({ ...data });
                      setIsEditTimeModalOpen(true);
                    }}
                  >
                    시간 수정
                  </button>{" "}
                  <button
                    className="copy-button"
                    onClick={() => {
                      setStudentToDelete(data.id);
                      setIsCopyModalOpen(true);
                    }}
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="ok-button" type="button" onClick={handleSort}>
        순서 변경
      </button>
    </div>
  );
}
