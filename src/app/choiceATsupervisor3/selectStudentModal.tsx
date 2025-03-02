import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./style.css";

interface Student {
  id: string;
  studentnumber: string;
  name?: string;
  comment?: string;
  check?: string;
  grade?: number;
  class?: number;
}

interface ClassInfo {
  grade: number;
  class: number;
}

export default function Page({
  setAttendance,
  props,
}: {
  props: Student[];
  setAttendance: (newState: Student[]) => void;
}) {
  // 모달 내 반 선택 상태 (반 선택 전에는 null)
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 전체 학생 데이터 (출석/미출석 정보 포함)
  const [studentsData, setStudentsData] = useState<Student[]>(props);
  // 임시 선택 (아직 출석 처리 전)
  const [tempSelection, setTempSelection] = useState<Student[]>([]);
  // 이름/번호 보기 토글
  const [viewByName, setViewByName] = useState(false);
  // 미출석 모드 관련 상태 및 선택/사유
  const [isAbsentMode, setIsAbsentMode] = useState(false);
  const [bulkAbsentSelection, setBulkAbsentSelection] = useState<Student[]>([]);
  const [bulkAbsentComment, setBulkAbsentComment] = useState("");

  // 모달 애니메이션 설정
  const modalAnimation = useSpring({
    transform: `translateY(${isModalOpen ? dragY : 100}%)`,
    opacity: isModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
    onRest: () => {
      if (!isModalOpen) {
        setIsModalVisible(false);
        // 모달 닫힐 때 관련 상태 초기화
        setIsAbsentMode(false);
        setBulkAbsentSelection([]);
        setBulkAbsentComment("");
      }
    },
  });

  const backdropAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    config: { duration: 300 },
  });

  const openModal = () => {
    setIsModalVisible(true);
    setIsModalOpen(true);
    setDragY(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 선택된 반의 학생들만 필터링
  const filteredStudents = selectedClass
    ? studentsData.filter(
        (s) =>
          s.grade === selectedClass.grade && s.class === selectedClass.class
      )
    : [];

  // 적용 버튼: 부모 컴포넌트에 최종 학생 데이터를 전달
  const handleConfirm = () => {
    setAttendance(studentsData);
    closeModal();
  };

  // 초기화 버튼: 선택된 반 학생들의 check와 comment만 초기화
  const handleReset = () => {
    setTempSelection([]);
    if (selectedClass) {
      setStudentsData((prev) =>
        prev.map((student) =>
          student.grade === selectedClass.grade &&
          student.class === selectedClass.class
            ? { ...student, check: undefined, comment: undefined }
            : student
        )
      );
    }
  };

  // 출석 버튼: 임시 선택한 학생들의 check를 "1"로 업데이트 (id로 비교)
  const handleAttendanceButton = () => {
    if (tempSelection.length > 0) {
      const updatedData = studentsData.map((student) => {
        if (tempSelection.find((s) => s.id === student.id)) {
          return { ...student, check: "1", comment: undefined };
        }
        return student;
      });
      setStudentsData(updatedData);
      setTempSelection([]);
    }
  };

  // 미출석 버튼: 미출석 모드 활성화하고 임시 선택 학생들을 bulkAbsentSelection으로 이동
  const handleAbsentButton = () => {
    setIsAbsentMode(true);
    if (tempSelection.length > 0) {
      setBulkAbsentSelection((prev) => [...prev, ...tempSelection]);
      setTempSelection([]);
    }
  };

  // 학생 클릭: 일반 모드에서는 tempSelection, 미출석 모드에서는 bulkAbsentSelection에 토글 (id 비교)
  const handleStudentClick = (student: Student) => {
    const alreadyProcessed = studentsData.find(
      (s) => s.id === student.id && (s.check || s.comment)
    );
    if (alreadyProcessed) return;

    if (isAbsentMode) {
      const existsInBulk = bulkAbsentSelection.find((s) => s.id === student.id);
      if (existsInBulk) {
        setBulkAbsentSelection((prev) =>
          prev.filter((s) => s.id !== student.id)
        );
      } else {
        setBulkAbsentSelection((prev) => [...prev, student]);
      }
    } else {
      const exists = tempSelection.find((s) => s.id === student.id);
      if (exists) {
        setTempSelection((prev) => prev.filter((s) => s.id !== student.id));
      } else {
        setTempSelection((prev) => [...prev, student]);
      }
    }
  };

  // 전체 선택/해제: 선택된 반의 아직 처리되지 않은 학생들만 대상으로 함
  const handleSetStateAll = () => {
    const allAvailable = filteredStudents.filter(
      (student) => !(student.check || student.comment)
    );
    if (tempSelection.length === allAvailable.length) {
      setTempSelection([]);
    } else {
      setTempSelection(allAvailable);
    }
  };

  // 출석 처리 완료된 학생의 check와 comment 제거 (재선택 가능)
  const handleClickSuccess = (student: Student) => {
    setStudentsData((prev) =>
      prev.map((s) =>
        s.id === student.id ? { ...s, check: undefined, comment: undefined } : s
      )
    );
  };

  const toggleView = () => {
    setViewByName(!viewByName);
  };

  // 미출석 모드 토글: 끄면 bulkAbsentSelection의 학생들을 임시 선택으로 이동
  const toggleAbsentMode = () => {
    if (isAbsentMode) {
      setIsAbsentMode(false);
      setTempSelection((prev) => [...prev, ...bulkAbsentSelection]);
      setBulkAbsentSelection([]);
      setBulkAbsentComment("");
    } else {
      setIsAbsentMode(true);
    }
  };

  // 미출석 선택 확정: bulkAbsentSelection의 학생들에게 comment 추가 및 check를 "0"으로 업데이트
  const handleBulkConfirm = () => {
    if (bulkAbsentComment.trim() === "") return;
    const updatedData = studentsData.map((student) => {
      if (bulkAbsentSelection.find((s) => s.id === student.id)) {
        return { ...student, comment: bulkAbsentComment, check: "0" };
      }
      return student;
    });
    setStudentsData(updatedData);
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode(false);
  };

  // 미출석 처리된 학생에서 comment 제거 (재선택 가능)
  const removeAbsentComment = (studentId: string) => {
    setStudentsData((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, check: undefined, comment: undefined } : s
      )
    );
  };

  // 학생 버튼 비활성화 여부: 이미 처리되었거나 선택된 경우
  const isStudentDisabled = (student: Student) => {
    const alreadyProcessed = studentsData.find(
      (s) => s.id === student.id && (s.check || s.comment)
    );
    const inTemp = tempSelection.find((s) => s.id === student.id);
    const inBulk = bulkAbsentSelection.find((s) => s.id === student.id);
    if (isAbsentMode) {
      return Boolean(alreadyProcessed || inBulk);
    }
    return Boolean(alreadyProcessed || inTemp || inBulk);
  };

  const handleAbsentClick = (student: Student) => {
    if (isAbsentMode) {
      setBulkAbsentSelection((prev) => prev.filter((s) => s.id !== student.id));
    }
  };

  // 드래그로 모달 닫기 설정
  const bind = useDrag(({ down, movement: [, my] }) => {
    if (down) {
      const vhRatio = (my / window.innerHeight) * 100;
      setDragY(Math.max(vhRatio, 0));
    } else {
      if (my > 100) {
        closeModal();
      } else {
        setDragY(0);
      }
    }
  });

  // 학생 데이터에서 고유한 학년/반 추출 (반 선택 UI용)
  const classList: ClassInfo[] = [];
  studentsData.forEach((student) => {
    if (student.grade !== undefined && student.class !== undefined) {
      const exists = classList.find(
        (c) => c.grade === student.grade && c.class === student.class
      );
      if (!exists) {
        classList.push({ grade: student.grade, class: student.class });
      }
    }
  });

  // 해당 반의 모든 학생이 처리되었는지 확인 (출석 혹은 미출석)
  const isClassComplete = (cls: ClassInfo) => {
    const classStudents = studentsData.filter(
      (s) => s.grade === cls.grade && s.class === cls.class
    );
    console.log(classStudents);
    if (classStudents.length === 0) return false;
    return classStudents.every(
      (s) =>
        s.check === "1" ||
        (s.check === "0" && s.comment !== undefined && s.comment !== "")
    );
  };

  // 모달 내에서 반 선택 시, 선택 상태 초기화
  const handleClassSelect = (cls: ClassInfo) => {
    setSelectedClass(cls);
    setTempSelection([]);
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode(false);
  };

  return (
    <div>
      <div className="cafe-top" style={{ padding: "10px" }}>
        <button
          className="plus-attendance-button"
          style={{
            marginLeft: "10px",
            backgroundColor: "rgb(138, 156, 255)",
          }}
          onClick={openModal}
        >
          선택메뉴
        </button>
      </div>
      {isModalVisible && (
        <>
          <animated.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
              ...backdropAnimation,
            }}
            onClick={closeModal}
          ></animated.div>
          <animated.div
            style={{
              ...modalAnimation,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px 10px 0 0",
              height: "80vh",
              overflowY: "hidden",
              touchAction: "none",
            }}
          >
            <div
              {...bind()}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "30%",
                  height: "3px",
                  marginBottom: "30px",
                  borderRadius: "100px",
                  cursor: "grab",
                  backgroundColor: "rgb(179, 179, 179)",
                }}
              ></div>
            </div>
            {/* 모달 내부 내용 */}
            {!selectedClass ? (
              // 모달 내 반 선택 UI
              <div className="class-selection">
                <h3 style={{ fontSize: "20px" }} className="modalTitle">
                  반 선택
                </h3>
                <div style={{ marginBottom: "10px" }}>반을 선택해 주세요.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {classList.map((cls) => (
                    <button
                      key={`${cls.grade}-${cls.class}`}
                      onClick={() => handleClassSelect(cls)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: isClassComplete(cls)
                          ? "rgb(138, 156, 255)"
                          : "lightgray",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {cls.grade}학년 {cls.class}
                      {isClassComplete(cls) && (
                        <span style={{ marginLeft: "5px", color: "green" }}>
                          (출석완료)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // 반 선택 후 출석/미출석 처리 UI
              <>
                <div
                  className="display-flex"
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginBottom: "20px",
                  }}
                >
                  <h3 className="modalTitle" style={{ fontSize: "20px" }}>
                    {selectedClass.grade}학년 {selectedClass.class}반
                  </h3>
                  <button
                    onClick={() => setSelectedClass(null)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "gray",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    반 변경
                  </button>
                  <div>
                    <button
                      className="studentNum-button"
                      onClick={handleSetStateAll}
                      disabled={isAbsentMode}
                    >
                      {tempSelection.length ===
                      filteredStudents.filter(
                        (student) => !(student.check || student.comment)
                      ).length
                        ? "전체 해제"
                        : "전체선택"}
                    </button>
                    <button
                      onClick={toggleView}
                      className="studentNum-button-show"
                    >
                      {viewByName ? "번호 보기" : "이름 보기"}
                    </button>
                    {isAbsentMode && (
                      <button
                        onClick={toggleAbsentMode}
                        className={
                          isAbsentMode
                            ? "studentNum-button-pink"
                            : "studentNum-button-green"
                        }
                      >
                        {isAbsentMode ? "일반선택" : null}
                      </button>
                    )}
                    {tempSelection.length > 0 && (
                      <>
                        <button
                          onClick={handleAttendanceButton}
                          className="studentNum-button"
                          style={{
                            backgroundColor: "rgb(138, 156, 255)",
                          }}
                        >
                          출석
                        </button>
                        <button
                          style={{
                            backgroundColor: "rgb(201, 99, 125)",
                          }}
                          onClick={handleAbsentButton}
                          className="studentNum-button"
                        >
                          미출석
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* 출석 완료된 학생 표시 */}
                {filteredStudents.some(
                  (s) => s.check === "1" || s.check === "0"
                ) && (
                  <div>
                    <h3 className="modalTitle" style={{ marginBottom: "5px" }}>
                      출석완료
                    </h3>
                    {filteredStudents
                      .filter(
                        (item) => item.check === "1" || item.check === "0"
                      )
                      .map((item) => (
                        <button
                          className="studentNum-button"
                          style={{
                            backgroundColor: item.comment
                              ? "rgb(201, 99, 125)"
                              : "rgb(138, 156, 255)",
                          }}
                          onClick={() => handleClickSuccess(item)}
                          key={item.id}
                        >
                          {viewByName ? item.name : item.studentnumber}
                        </button>
                      ))}
                  </div>
                )}
                <div
                  className="slider"
                  style={{
                    height: filteredStudents.some(
                      (s) => s.check === "1" || s.check === "0"
                    )
                      ? "50vh"
                      : "57.8vh",
                  }}
                >
                  {/* 미출석 모드: comment 입력 영역 */}
                  {isAbsentMode && (
                    <div className="notat-comment">
                      <h3
                        className="modalTitle"
                        style={{ marginBottom: "10px" }}
                      >
                        미출석 선택됨
                      </h3>
                      {bulkAbsentSelection.length > 0 ? (
                        bulkAbsentSelection.map((student) => (
                          <button
                            className="studentNum-button-pink"
                            key={student.id}
                            onClick={() => handleAbsentClick(student)}
                          >
                            {viewByName ? student.name : student.studentnumber}
                          </button>
                        ))
                      ) : (
                        <div>선택된 학생이 없습니다.</div>
                      )}
                      <div style={{ marginTop: "10px" }}>
                        <input
                          className="text-input"
                          type="text"
                          placeholder="미출석 사유 입력"
                          value={bulkAbsentComment}
                          onChange={(e) => setBulkAbsentComment(e.target.value)}
                        />
                        <button
                          style={{ marginTop: "10px" }}
                          className="studentNum-button"
                          onClick={handleBulkConfirm}
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  )}
                  {/* 일반 모드: 임시 선택된 학생 표시 */}
                  {!isAbsentMode && tempSelection.length > 0 && (
                    <div className="notat-comment">
                      <h3
                        className="modalTitle"
                        style={{ marginBottom: "5px" }}
                      >
                        임시 선택됨
                      </h3>
                      {tempSelection.map((item) => (
                        <button
                          className="studentNum-button"
                          style={{ backgroundColor: "#59ad5c" }}
                          onClick={() => handleStudentClick(item)}
                          key={item.id}
                        >
                          {viewByName ? item.name : item.studentnumber}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="line" style={{ marginTop: "10px" }}></div>
                  {/* 전체 학생 리스트 */}
                  <div className="notat-comment">
                    <h3 className="modalTitle" style={{ marginBottom: "5px" }}>
                      학생 리스트
                    </h3>
                    {filteredStudents.map((item) => (
                      <button
                        className={
                          isAbsentMode
                            ? "studentNum-button-pink"
                            : "studentNum-button"
                        }
                        onClick={() => handleStudentClick(item)}
                        key={item.id}
                        disabled={isStudentDisabled(item)}
                      >
                        {viewByName ? item.name : item.studentnumber}
                      </button>
                    ))}
                    <div className="line" style={{ marginTop: "10px" }}></div>
                  </div>
                  {/* 미출석 처리된 학생 목록 */}
                  {filteredStudents.filter((s) => s.comment && s.comment !== "")
                    .length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h3>미출석 학생</h3>
                      {filteredStudents
                        .filter((s) => s.comment && s.comment !== "")
                        .map((student) => (
                          <div
                            className="notat-comment"
                            key={student.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "5px",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <div
                                className="attendance-student-name"
                                style={{ marginRight: "10px" }}
                              >
                                {student.name} ({student.studentnumber})
                              </div>
                              <div style={{ fontSize: "12px" }}>
                                이유 : ({student.comment})
                              </div>
                            </div>
                            <button
                              onClick={() => removeAbsentComment(student.id)}
                              className="studentNum-button-pink"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="ok-button-div">
                  <button
                    className="ok-button"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "rgb(63, 63, 63)",
                    }}
                    onClick={handleReset}
                  >
                    초기화
                  </button>
                  <button className="ok-button" onClick={handleConfirm}>
                    적용
                  </button>
                </div>
              </>
            )}
          </animated.div>
        </>
      )}
    </div>
  );
}
