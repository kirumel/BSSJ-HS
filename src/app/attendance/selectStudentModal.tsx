import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./style.css";

interface Student {
  id: any;
  studentnumber: string;
  name?: string;
  comment?: string;
  check?: string;
}

export default function Page({
  setAttendance,
  props,
}: {
  props: Student[];
  setAttendance: (newState: Student[]) => void;
}) {
  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 전체 학생 데이터를 props로부터 받아 state에 저장 (출석/미출석 정보를 포함)
  const [studentsData, setStudentsData] = useState<Student[]>(props);
  // 임시 선택 (출석 처리 전)
  const [tempSelection, setTempSelection] = useState<Student[]>([]);
  // 이름/번호 보기 토글
  const [viewByName, setViewByName] = useState(false);
  // 미출석 모드 여부 및 관련 선택/사유
  const [isAbsentMode, setIsAbsentMode] = useState(false);
  const [bulkAbsentSelection, setBulkAbsentSelection] = useState<Student[]>([]);
  const [bulkAbsentComment, setBulkAbsentComment] = useState("");

  console.log(studentsData, tempSelection, bulkAbsentSelection);

  // 적용 버튼: 최종 studentsData를 부모 컴포넌트에 전달
  const handleConfirm = () => {
    setAttendance(studentsData);
    closeModal();
  };

  // 초기화 버튼: tempSelection은 비우고, 전체 학생의 check와 comment만 초기화
  const handleReset = () => {
    setTempSelection([]);
    setStudentsData((prev) =>
      prev.map((student) => ({
        ...student,
        check: undefined,
        comment: undefined,
      }))
    );
  };

  // 출석 버튼: tempSelection에 담긴 학생들의 check를 "1"로 업데이트
  const handleAttendanceButton = () => {
    if (tempSelection.length > 0) {
      const updatedData = studentsData.map((student) => {
        if (
          tempSelection.find((s) => s.studentnumber === student.studentnumber)
        ) {
          return { ...student, check: "1", comment: undefined };
        }
        return student;
      });
      setStudentsData(updatedData);
      setTempSelection([]);
    }
  };

  // 미출석 버튼: 미출석 모드 활성화하고 tempSelection의 학생들을 bulkAbsentSelection으로 이동
  const handleAbsentButton = () => {
    setIsAbsentMode(true);
    if (tempSelection.length > 0) {
      setBulkAbsentSelection((prev) => [...prev, ...tempSelection]);
      setTempSelection([]);
    }
  };

  const modalAnimation = useSpring({
    transform: `translateY(${isModalOpen ? dragY : 100}%)`,
    opacity: isModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
    onRest: () => {
      if (!isModalOpen) {
        setIsModalVisible(false);
        // 모달 닫힐 때 미출석 모드와 관련 선택/사유 초기화
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

  // 학생 클릭: 일반 모드에서는 tempSelection에, 미출석 모드에서는 bulkAbsentSelection에 토글
  // 단, 이미 출석(check) 또는 미출석(comment) 처리된 학생은 선택되지 않음
  const handleStudentClick = (student: Student) => {
    const alreadyProcessed = studentsData.find(
      (s) => s.studentnumber === student.studentnumber && (s.check || s.comment)
    );
    if (alreadyProcessed) return;

    if (isAbsentMode) {
      const existsInBulk = bulkAbsentSelection.find(
        (s) => s.studentnumber === student.studentnumber
      );
      if (existsInBulk) {
        setBulkAbsentSelection((prev) =>
          prev.filter((s) => s.studentnumber !== student.studentnumber)
        );
      } else {
        setBulkAbsentSelection((prev) => [...prev, student]);
      }
    } else {
      const exists = tempSelection.find(
        (s) => s.studentnumber === student.studentnumber
      );
      if (exists) {
        setTempSelection((prev) =>
          prev.filter((s) => s.studentnumber !== student.studentnumber)
        );
      } else {
        setTempSelection((prev) => [...prev, student]);
      }
    }
  };

  // 전체 선택/해제 (일반 모드): 아직 처리되지 않은 학생들을 대상으로 함
  const handleSetStateAll = () => {
    const allAvailable = studentsData.filter(
      (student) => !(student.check || student.comment)
    );
    if (tempSelection.length === allAvailable.length) {
      setTempSelection([]);
    } else {
      setTempSelection(allAvailable);
    }
  };

  // 이미 출석 처리된 학생(출석된 경우)의 check와 comment 제거하여 재선택 가능하게 함
  const handleClickSuccess = (student: Student) => {
    setStudentsData((prev) =>
      prev.map((s) =>
        s.studentnumber === student.studentnumber
          ? { ...s, check: undefined, comment: undefined }
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

  // 미출석 선택 확정: bulkAbsentSelection에 있는 학생들에게 comment를 추가하고 check를 "0"으로 업데이트
  const handleBulkConfirm = () => {
    if (bulkAbsentComment.trim() === "") return;
    const updatedData = studentsData.map((student) => {
      if (
        bulkAbsentSelection.find(
          (s) => s.studentnumber === student.studentnumber
        )
      ) {
        return { ...student, comment: bulkAbsentComment, check: "0" };
      }
      return student;
    });
    setStudentsData(updatedData);
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode(false);
  };

  // 미출석 처리된 학생에서 comment를 제거 (재선택 가능하도록)
  const removeAbsentComment = (studentnumber: string) => {
    setStudentsData((prev) =>
      prev.map((s) =>
        s.studentnumber === studentnumber
          ? { ...s, check: undefined, comment: undefined }
          : s
      )
    );
  };

  // 학생 버튼 비활성화: 이미 출석(check) 또는 미출석(comment) 처리되었거나, 임시 선택된 경우 선택 불가
  const isStudentDisabled = (student: Student) => {
    const alreadyProcessed = studentsData.find(
      (s) => s.studentnumber === student.studentnumber && (s.check || s.comment)
    );
    const inTemp = tempSelection.find(
      (s) => s.studentnumber === student.studentnumber
    );
    const inBulk = bulkAbsentSelection.find(
      (s) => s.studentnumber === student.studentnumber
    );
    if (isAbsentMode) {
      return Boolean(alreadyProcessed || inBulk);
    }
    return Boolean(alreadyProcessed || inTemp || inBulk);
  };

  const handleAbsentClick = (student: Student) => {
    if (isAbsentMode) {
      setBulkAbsentSelection((prev) =>
        prev.filter((s) => s.studentnumber !== student.studentnumber)
      );
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

  return (
    <div>
      <div className="cafe-top">
        <button
          className="plus-attendance-button"
          style={{ marginLeft: "10px", backgroundColor: "rgb(138, 156, 255)" }}
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
              <div
                className="display-flex"
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginBottom: "20px",
                }}
              >
                <h3 className="margin0 modalTitle" style={{ fontSize: "20px" }}>
                  선택메뉴
                </h3>
                <div>
                  <button
                    className="studentNum-button"
                    onClick={handleSetStateAll}
                    disabled={isAbsentMode}
                  >
                    {tempSelection.length ===
                    studentsData.filter(
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
              {studentsData.some((s) => s.check === "1" || s.check === "0") && (
                <div>
                  <h3
                    className="modalTitle margin0"
                    style={{ marginBottom: "5px" }}
                  >
                    출석완료
                  </h3>
                  {studentsData
                    .filter((item) => item.check === "1" || item.check === "0")
                    .map((item) => (
                      <button
                        className="studentNum-button"
                        style={{
                          backgroundColor: item.comment
                            ? "rgb(201, 99, 125)"
                            : "rgb(138, 156, 255)",
                        }}
                        onClick={() => handleClickSuccess(item)}
                        key={item.studentnumber}
                      >
                        {viewByName ? item.name : item.studentnumber}
                      </button>
                    ))}
                </div>
              )}
              <div
                className="slider"
                style={{
                  height: studentsData.some(
                    (s) => s.check === "1" || s.check === "0"
                  )
                    ? "50vh"
                    : "57.8vh",
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
                        <button
                          className="studentNum-button-pink"
                          key={student.studentnumber}
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
                      className="modalTitle margin0"
                      style={{ marginBottom: "5px" }}
                    >
                      임시 선택됨
                    </h3>
                    {tempSelection.map((item) => (
                      <button
                        className="studentNum-button"
                        style={{ backgroundColor: "#59ad5c" }}
                        onClick={() => handleStudentClick(item)}
                        key={item.studentnumber}
                      >
                        {viewByName ? item.name : item.studentnumber}
                      </button>
                    ))}
                  </div>
                )}
                <div className="line" style={{ marginTop: "10px" }}></div>
                {/* 전체 학생 리스트 */}
                <div className="notat-comment">
                  <h3
                    className="margin0 modalTitle"
                    style={{ marginBottom: "5px" }}
                  >
                    학생 리스트
                  </h3>
                  {studentsData.map((item) => (
                    <button
                      className={
                        isAbsentMode
                          ? "studentNum-button-pink"
                          : "studentNum-button"
                      }
                      onClick={() => handleStudentClick(item)}
                      key={item.studentnumber}
                      disabled={isStudentDisabled(item)}
                    >
                      {viewByName ? item.name : item.studentnumber}
                    </button>
                  ))}
                  <div className="line" style={{ marginTop: "10px" }}></div>
                </div>
                {/* 미출석 처리된 학생 목록 */}
                {studentsData.filter((s) => s.comment).length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h3>미출석 학생</h3>
                    {studentsData
                      .filter((s) => s.comment)
                      .map((student) => (
                        <div
                          className="notat-comment"
                          key={student.studentnumber}
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
                            onClick={() =>
                              removeAbsentComment(student.studentnumber)
                            }
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
            </animated.div>
          </>
        )}
      </div>
    </div>
  );
}
