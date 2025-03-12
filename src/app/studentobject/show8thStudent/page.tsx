"use client";
import axios from "axios";
import "../addStudentObject/style.css";
import { useEffect, useState } from "react";
import Loading from "@/app/loading/page";

// 모달 컴포넌트 개선
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
  const [copyDB, setCopyDB] = useState("mainAttendanceObject");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  console.log(selectedClass);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/post/attendance");

        setStudents(response.data);
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

    // 학년과 반 모두 선택되었을 때
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
            students: [studentData], // 하나의 학생만 복사
            targetDB: copyDB,
          })
          .then((response) => {
            if (response.status === 200) {
              alert(`선택된 학생이 ${copyDB} DB로 복사되었습니다.`);
            }
          });
      }
      setStudentToDelete(null); // 복사 후 모달 닫기
    } catch (error) {
      console.error("Failed to copy student:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          // 만약 선택된 학생이 있으면 선택된 학생들만 삭제
          if (selectedStudents.size > 0) {
            deleteSelectedStudents();
          } else if (studentToDelete) {
            // 아니면, 개별 학생 삭제
            deleteStudent(studentToDelete);
          }
        }}
        title="학생 삭제 확인"
        modalContent={<p>정말 이 학생을 삭제하시겠습니까?</p>}
      />

      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onConfirm={() => {
          // 만약 선택된 학생이 있으면 선택된 학생들만 복사
          if (selectedStudents.size > 0) {
            copySelectedStudentsToDB();
          } else if (studentToDelete) {
            // 아니면, 개별 학생 복사
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
              <option value="mainAttendanceObject">모든 학생 목록</option>
              <option value="nightAttendanceObject">야자 학생 목록</option>
            </select>
          </>
        }
      />

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
                </div>
                <div>
                  <p className="attendance-student-number">
                    {data.studentnumber}번
                  </p>
                </div>
                <div>
                  <input
                    className="select-button"
                    type="checkbox"
                    checked={selectedStudents.has(data.id)}
                    onChange={() => handleSelectStudent(data.id)}
                    style={{ marginRight: "10px" }}
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
    </div>
  );
}
