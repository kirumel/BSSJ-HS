import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./style.css";

interface Student {
  outTimeT2: React.ReactNode;
  outTimeT: React.ReactNode;
  id: any;
  studentnumber: string;
  name?: string;
  comment?: string;
  check?: string; // "1": 출석, "0": 미출석(사유 입력 후), "2": 1차 출석에서 미출석 기록(2차 출석에서 수정 불가)
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
  // 반 선택 상태 (선택하지 않으면 모달 내에서 반 선택 UI가 나타남)
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 시간 관련 상태
  const [selectedTime, setSelectedTime] = useState("");

  // 전체 학생 데이터 및 선택 상태
  const [studentsData, setStudentsData] = useState<Student[]>(props);
  const [tempSelection, setTempSelection] = useState<Student[]>([]);
  const [viewByName, setViewByName] = useState(false);
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

  // 선택된 반이 있으면 해당 반의 학생만, 없으면 모달 내에서 반 선택 UI가 표시되도록 함
  const filteredStudents = selectedClass
    ? studentsData.filter(
        (s) =>
          s.grade === selectedClass.grade && s.class === selectedClass.class
      )
    : [];

  // 최종 데이터 적용: outTimeT2 값이 있으면 우선 사용
  const handleConfirm = () => {
    setAttendance(
      studentsData.map((student) => ({
        ...student,
        outTimeST: student.outTimeT2 ? student.outTimeT2 : student.outTimeT,
      }))
    );
    closeModal();
  };

  // 초기화: 선택된 학생들의 check, comment, outTimeT2 초기화
  const handleReset = () => {
    setTempSelection([]);
    if (selectedClass) {
      setStudentsData((prev) =>
        prev.map((student) =>
          student.grade === selectedClass.grade &&
          student.class === selectedClass.class
            ? {
                ...student,
                check: undefined,
                comment: undefined,
                outTimeT2: undefined,
              }
            : student
        )
      );
    } else {
      setStudentsData((prev) =>
        prev.map((student) => ({
          ...student,
          check: undefined,
          comment: undefined,
          outTimeT2: undefined,
        }))
      );
    }
  };

  // 출석 버튼: 임시 선택된 학생의 check를 "1"로, 선택 시간을 outTimeT2로 업데이트
  const handleAttendanceButton = () => {
    if (tempSelection.length > 0) {
      const updatedData = studentsData.map((student) => {
        if (tempSelection.find((s) => s.id === student.id)) {
          return {
            ...student,
            check: "1",
            comment: undefined,
            outTimeT2: selectedTime,
          };
        }
        return student;
      });
      setStudentsData(updatedData);
      setTempSelection([]);
      setSelectedTime("");
    }
  };

  // 미출석 버튼: 미출석 모드 활성화 후 임시 선택 학생을 bulkAbsentSelection으로 이동
  const handleAbsentButton = () => {
    setIsAbsentMode(true);
    if (tempSelection.length > 0) {
      setBulkAbsentSelection((prev) => [...prev, ...tempSelection]);
      setTempSelection([]);
    }
  };

  // 학생 클릭: 일반 모드와 미출석 모드에서 각각 선택/해제 (고유 id 기준)
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

  // 전체 선택/해제: 아직 처리되지 않은 학생들을 대상으로 함
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

  // 이미 처리된 학생은 재선택 가능하도록 (단, check가 "2"인 경우는 수정 불가)
  const handleClickSuccess = (student: Student) => {
    if (student.check === "2") return;
    setStudentsData((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, check: undefined, comment: undefined, outTimeT2: undefined }
          : s
      )
    );
  };

  const toggleView = () => {
    setViewByName(!viewByName);
  };

  // 미출석 모드 토글: 끄면 bulkAbsentSelection의 학생들을 tempSelection으로 이동
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

  // 미출석 선택 확정: bulkAbsentSelection에 있는 학생들에게 comment 추가, check를 "0"으로, 시간 적용
  const handleBulkConfirm = () => {
    if (bulkAbsentComment.trim() === "") return;
    const updatedData = studentsData.map((student) => {
      if (bulkAbsentSelection.find((s) => s.id === student.id)) {
        return {
          ...student,
          comment: bulkAbsentComment,
          check: "0",
          outTimeT2: selectedTime,
        };
      }
      return student;
    });
    setStudentsData(updatedData);
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode(false);
  };

  // 미출석 처리된 학생에서 comment 제거 (재선택 가능하게)
  const removeAbsentComment = (studentId: any) => {
    setStudentsData((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, check: undefined, comment: undefined, outTimeT2: undefined }
          : s
      )
    );
  };
  console.log(
    filteredStudents.filter(
      (s) => s.comment || s.check === "2" || s.check === "0"
    )
  );
  // 학생 버튼 비활성화 조건 (이미 처리된 학생은 선택 불가)
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

  // 학년/반 정보 추출 (반 선택 UI용)
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

  // 해당 반의 모든 학생이 처리되었는지 여부 (check "2"도 완료로 판단)
  const isClassComplete = (cls: ClassInfo) => {
    const classStudents = studentsData.filter(
      (s) => s.grade === cls.grade && s.class === cls.class
    );
    if (classStudents.length === 0) return false;
    return classStudents.every(
      (s) =>
        s.check === "1" ||
        s.check === "2" ||
        (s.check === "0" && s.comment && s.comment !== "")
    );
  };

  // 반 선택 시 상태 초기화
  const handleClassSelect = (cls: ClassInfo) => {
    setSelectedClass(cls);
    setTempSelection([]);
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode(false);
  };

  // 출석완료 섹션에 표시할 학생들 (check "1", "0", "2" 모두 포함)
  const completeStudents = filteredStudents.filter(
    (item) => item.check === "1" || item.check === "0" || item.check === "2"
  );

  return (
    <div>
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
              height: "90vh",
              overflowY: "hidden",
              touchAction: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
              {...bind()}
            >
              <div
                style={{
                  width: "30%",
                  height: "3px",
                  marginBottom: "20px",
                  borderRadius: "100px",
                  cursor: "grab",
                  backgroundColor: "rgb(179, 179, 179)",
                }}
              ></div>
            </div>
            {/* 모달 내부 내용 */}
            {!selectedClass ? (
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
                      {cls.grade}학년 {cls.class}반{" "}
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
              <>
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="display-flex"
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <h3
                      className="modalTitle"
                      style={{ fontSize: "20px", margin: "0" }}
                    >
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
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      justifyContent: "right",
                    }}
                  >
                    {isAbsentMode && (
                      <div>
                        <input
                          className="time-input"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
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
                      </div>
                    )}
                    {tempSelection.length > 0 && (
                      <>
                        <input
                          className="time-input"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
                        <button
                          onClick={handleAttendanceButton}
                          className="studentNum-button"
                          style={{ backgroundColor: "rgb(138, 156, 255)" }}
                        >
                          출석
                        </button>
                        <button
                          style={{ backgroundColor: "rgb(201, 99, 125)" }}
                          onClick={handleAbsentButton}
                          className="studentNum-button"
                        >
                          미출석
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 출석완료 섹션 */}
                {completeStudents.length > 0 && (
                  <div>
                    <h3
                      className="modalTitle margin0"
                      style={{ marginBottom: "5px" }}
                    >
                      출석완료
                    </h3>
                    {completeStudents.map((item) => {
                      const isFirstAbsent = item.check === "2";
                      return (
                        <div key={item.id} style={{ display: "inline-flex" }}>
                          <button
                            className="studentNum-button"
                            style={{
                              backgroundColor:
                                isFirstAbsent || item.comment
                                  ? "rgb(201, 99, 125)"
                                  : "rgb(138, 156, 255)",
                              opacity: isFirstAbsent ? 0.5 : 1,
                              display: "flex",
                              justifyContent: "center",
                              pointerEvents: isFirstAbsent ? "none" : "auto",
                              marginRight: "5px",
                            }}
                            onClick={
                              isFirstAbsent
                                ? undefined
                                : () => handleClickSuccess(item)
                            }
                            disabled={isFirstAbsent}
                          >
                            <div
                              style={{
                                marginRight: `${item.outTimeT ? "3px" : ""}`,
                              }}
                            >
                              {viewByName ? item.name : item.studentnumber}
                            </div>
                            <div>
                              /{" "}
                              {item.outTimeT2 ? item.outTimeT2 : item.outTimeT}
                            </div>
                            {isFirstAbsent && " (미출석)"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div
                  className="slider"
                  style={{
                    height: completeStudents.length > 0 ? "50vh" : "57.8vh",
                  }}
                >
                  {/* 미출석 모드: comment 입력 영역 */}
                  {isAbsentMode && (
                    <div className="notat-comment">
                      <h3 className="margin0" style={{ marginBottom: "10px" }}>
                        미출석 선택됨
                      </h3>
                      {bulkAbsentSelection.length > 0 ? (
                        bulkAbsentSelection.map((student) => (
                          <div
                            key={student.id}
                            style={{ display: "inline-flex" }}
                          >
                            <button
                              className="studentNum-button-pink"
                              onClick={() => handleAbsentClick(student)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "5px",
                              }}
                            >
                              <div
                                style={{
                                  marginRight: `${
                                    student.outTimeT ? "3px" : ""
                                  }`,
                                }}
                              >
                                {viewByName
                                  ? student.name
                                  : student.studentnumber}
                              </div>
                              <div>/ {student.outTimeT}</div>
                            </button>
                          </div>
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
                  {/* 임시 선택된 학생 표시 */}
                  {!isAbsentMode && tempSelection.length > 0 && (
                    <div className="notat-comment">
                      <h3
                        className="modalTitle margin0"
                        style={{ marginBottom: "5px" }}
                      >
                        임시 선택됨
                      </h3>
                      {tempSelection.map((item) => (
                        <div key={item.id} style={{ display: "inline-flex" }}>
                          <button
                            className="studentNum-button"
                            style={{
                              backgroundColor: "#59ad5c",
                              display: "flex",
                              justifyContent: "center",
                              marginRight: "5px",
                            }}
                            onClick={() => handleStudentClick(item)}
                          >
                            <div
                              style={{
                                marginRight: `${item.outTimeT ? "3px" : ""}`,
                              }}
                            >
                              {viewByName ? item.name : item.studentnumber}
                            </div>
                            <div>/ {item.outTimeT}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="line" style={{ marginTop: "10px" }}></div>
                  {/* 전체 학생 리스트 (선택한 반의 학생만 표시) */}
                  <div className="notat-comment">
                    <h3
                      className="modalTitle margin0"
                      style={{ marginBottom: "5px" }}
                    >
                      학생 리스트
                    </h3>
                    {filteredStudents.map((item) => (
                      <div key={item.id} style={{ display: "inline-flex" }}>
                        <button
                          className={
                            isAbsentMode
                              ? "studentNum-button-pink"
                              : "studentNum-button"
                          }
                          onClick={() => handleStudentClick(item)}
                          disabled={isStudentDisabled(item)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          <div
                            style={{
                              marginRight: `${item.outTimeT ? "3px" : ""}`,
                            }}
                          >
                            {viewByName ? item.name : item.studentnumber}
                          </div>
                          <div>/ {item.outTimeT}</div>
                        </button>
                      </div>
                    ))}
                    <div className="line" style={{ marginTop: "10px" }}></div>
                  </div>
                  {/* 미출석 처리된 학생 목록 (선택한 반의 학생만 표시) */}
                  {filteredStudents.filter(
                    (s) => s.comment || s.check === "2" || s.check === "0"
                  ).length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h3>미출석 학생</h3>
                      {filteredStudents
                        .filter(
                          (s) => s.comment || s.check === "2" || s.check === "0"
                        )
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
                                {student.name} ({student.studentnumber}) / (
                                {student.outTimeT2})
                              </div>
                              <div style={{ fontSize: "12px" }}>
                                이유 : ({student.comment})
                              </div>
                            </div>
                            <button
                              onClick={() => removeAbsentComment(student.id)}
                              disabled={student.check === "2"}
                              className="studentNum-button-pink"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "2vw",
                    margin: "10px",
                    textAlign: "center",
                  }}
                  className="subtitle"
                >
                  선택 후 시간을 선택하지 않으면 기존 등록된 시간이 사용됩니다
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
