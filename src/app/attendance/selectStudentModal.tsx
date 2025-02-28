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
  props: any;
  setAttendance: (newState: Student[]) => void;
}) {
  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 이미 확정된 학생들 (미출석은 comment가 있음)
  const [state, setState] = useState<Student[]>([]);
  // 일반 모드에서 임시 선택한 학생들 (출석할 학생들)
  const [tempSelection, setTempSelection] = useState<Student[]>([]);
  // 이름/번호 보기 토글
  const [viewByName, setViewByName] = useState(false);
  // 미출석 모드 여부
  const [isAbsentMode, setIsAbsentMode] = useState(false);
  // 미출석 모드에서 일괄 선택한 학생들 (아직 comment 미적용)
  const [bulkAbsentSelection, setBulkAbsentSelection] = useState<Student[]>([]);
  // 미출석 모드에서 일괄 입력할 comment
  const [bulkAbsentComment, setBulkAbsentComment] = useState("");

  console.log(state, tempSelection, bulkAbsentSelection);

  const handleConfirm = () => {
    setAttendance(state);

    closeModal();
  };

  // 초기화 버튼: tempSelection과 state 모두 초기화
  const handleReset = () => {
    setTempSelection([]);
    setState([]);
  };

  // 출석 버튼: tempSelection에 담긴 학생들을 check:"1" 상태로 state에 옮기고 tempSelection 비우기
  const handleAttendanceButton = () => {
    if (tempSelection.length > 0) {
      const committed = tempSelection.map((student) => ({
        ...student,
        check: "1",
      }));
      setState((prev) => [...prev, ...committed]);
      setTempSelection([]);
    }
  };

  // 미출석 버튼: 미출석 모드 활성화 후 tempSelection의 학생들을 bulkAbsentSelection에 옮기기
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
        // 모달 닫힐 때 미출석 모드와 bulk 선택 초기화
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

  // 일반 모드: 학생 클릭 시 tempSelection에 토글
  // 미출석 모드: bulkAbsentSelection에 토글
  const handleStudentClick = (student: Student) => {
    if (isAbsentMode) {
      const existsInState = state.find(
        (s) => s.studentnumber === student.studentnumber
      );
      const existsInBulk = bulkAbsentSelection.find(
        (s) => s.studentnumber === student.studentnumber
      );
      if (existsInBulk) {
        setBulkAbsentSelection((prev) =>
          prev.filter((s) => s.studentnumber !== student.studentnumber)
        );
      } else if (!existsInState) {
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
        setTempSelection((prev) => [
          ...prev,
          { ...student, check: "1" }, // 출석은 check:"1"
        ]);
      }
    }
  };

  // 전체 선택/해제 (일반 모드에서만 작동)
  const handleSetStateAll = () => {
    const allStudents: Student[] = props;
    if (
      tempSelection.length ==
      allStudents.filter((student) => !state.some((s) => s.id === student.id))
        .length
    ) {
      setTempSelection([]);
    } else {
      setTempSelection(
        allStudents.filter((student) => !state.some((s) => s.id === student.id))
      );
    }
  };

  const handleClickSuccess = (student: Student) => {
    setState((prev) => prev.filter((s) => s.id !== student.id));
  };

  const toggleView = () => {
    setViewByName(!viewByName);
  };

  // 미출석 선택기 토글 버튼 (기존 기능 그대로)
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

  // bulk로 선택된 학생들에게 comment 적용 (미출석: check:"0")
  const handleBulkConfirm = () => {
    if (bulkAbsentComment.trim() === "") return;
    const updatedStudents: Student[] = bulkAbsentSelection.map((student) => ({
      ...student,
      comment: bulkAbsentComment,
    }));
    setState((prev) =>
      prev.concat(
        updatedStudents.map((student) => ({ ...student, check: "0" }))
      )
    );
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode(false);
  };

  // 미출석 처리된 학생의 comment 제거 (출석 전환 가능)
  const removeAbsentComment = (studentnumber: string) => {
    setState((prev) =>
      prev.map((s) =>
        s.studentnumber === studentnumber
          ? { ...s, check: undefined, comment: undefined }
          : s
      )
    );
  };

  // 학생 버튼 비활성화: 일반 모드에서는 tempSelection에 포함되면 비활성화, 미출석 모드에서는 이미 state 또는 bulkAbsentSelection에 포함되면 비활성화
  const isStudentDisabled = (student: Student) => {
    const existsInState = state.find(
      (s) => s.studentnumber === student.studentnumber
    );
    const existsInBulk = bulkAbsentSelection.find(
      (s) => s.studentnumber === student.studentnumber
    );
    const existsInTemp = tempSelection.find(
      (s) => s.studentnumber === student.studentnumber
    );
    if (isAbsentMode) {
      return Boolean(existsInState || existsInBulk);
    }

    return Boolean(existsInState || existsInTemp || existsInBulk);
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
                {/*버튼들*/}
                <div>
                  {/* 전체 선택 버튼*/}
                  <button
                    className="studentNum-button"
                    onClick={handleSetStateAll}
                    disabled={isAbsentMode}
                  >
                    {tempSelection.length ===
                    props.filter(
                      (student: Student) =>
                        !state.some((s) => s.id === student.id)
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
                  {/* 기존 미출석 선택기 토글 버튼 */}
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

                  {/* 새로 추가한 출석/미출석 버튼 */}
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
              {/* tempSelection에 담긴 출석 학생들 표시 */}
              {!isAbsentMode && state.length > 0 && (
                <div>
                  <h3
                    className="modalTitle margin0"
                    style={{ marginBottom: "5px" }}
                  >
                    출석완료
                  </h3>
                  {state.map((item) => (
                    <button
                      className="studentNum-button"
                      style={{
                        backgroundColor: `${
                          item.comment
                            ? "rgb(201, 99, 125)"
                            : "rgb(138, 156, 255)"
                        }`,
                      }}
                      onClick={() => {
                        handleClickSuccess(item);
                      }}
                      key={item.studentnumber}
                    >
                      {viewByName ? item.name : item.studentnumber}
                    </button>
                  ))}
                </div>
              )}
              <div
                className="slider"
                style={{ height: `${state.length > 0 ? "50vh" : "57.8vh"}` }}
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
                {/* tempSelection에 담긴 출석 학생들 표시 */}
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
                        onClick={() => {
                          handleStudentClick(item);
                        }}
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
                  {props.map((item: Student) => (
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
                {/* 미출석 처리된 학생 목록*/}
                {state.filter((s) => s.comment).length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h3>미출석 학생</h3>
                    {state
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
