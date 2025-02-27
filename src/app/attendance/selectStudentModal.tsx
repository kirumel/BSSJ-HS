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

  // 출석(혹은 미출석 확인된) 학생들 저장
  const [state, setState] = useState<Student[]>([]);
  // 일반 출석 모드에서 이름 보기/번호 보기 토글
  const [viewByName, setViewByName] = useState(false);
  // 미출석 모드 여부 (미출석 선택기 토글)
  const [isAbsentMode, setIsAbsentMode] = useState(false);
  // 미출석 모드에서 일괄 선택한 학생들(아직 comment 미적용)
  const [bulkAbsentSelection, setBulkAbsentSelection] = useState<Student[]>([]);
  // 미출석 모드에서 일괄 입력할 comment
  const [bulkAbsentComment, setBulkAbsentComment] = useState("");
  const handleConfirm = () => {
    setAttendance(state);
    closeModal();
  };
  console.log(state);
  // 모달 애니메이션
  const modalAnimation = useSpring({
    transform: `translateY(${isModalOpen ? dragY : 100}%)`,
    opacity: isModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
    onRest: () => {
      if (!isModalOpen) {
        setIsModalVisible(false);
        // 모달 닫을 때 미출석 모드와 bulk 선택도 초기화
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
  console.log(state);
  // 일반 모드에서는 학생 클릭 시 state에 출석(혹은 선택)으로 추가/제거
  // 미출석 모드에서는 bulkAbsentSelection에 추가/제거 (일괄 comment 적용 전)
  const handleStudentClick = (student: Student) => {
    if (isAbsentMode) {
      const existsInState = state.find(
        (s) => s.studentnumber === student.studentnumber
      );
      const existsInBulk = bulkAbsentSelection.find(
        (s) => s.studentnumber === student.studentnumber
      );
      // state나 bulk에 이미 있으면 toggle로 제거
      if (existsInBulk) {
        setBulkAbsentSelection((prev) =>
          prev.filter((s) => s.studentnumber !== student.studentnumber)
        );
      } else if (!existsInState) {
        setBulkAbsentSelection((prev) => [...prev, student]);
      }
    } else {
      // 일반 모드: 이미 선택되어 있으면 해제, 아니면 추가
      const exists = state.find(
        (s) => s.studentnumber === student.studentnumber
      );
      if (exists) {
        // 미출석 처리된 학생(comment가 있는)은 토글 해제 불가
        if (!exists.comment) {
          setState((prev) =>
            prev.filter((s) => s.studentnumber !== student.studentnumber)
          );
        }
      } else {
        setState((prev) => [...prev, { ...student, check: "1" }]);
      }
    }
  };

  // 전체 선택/해제 (일반 출석 모드에서만 작동)
  const handleSetStateAll = () => {
    const allStudents: Student[] = props;
    if (state.length === allStudents.length) {
      setState([]);
    } else {
      setState(allStudents);
    }
  };

  const toggleView = () => {
    setViewByName(!viewByName);
  };

  // 미출석 모드 토글 (버튼 텍스트가 "미출석 선택기" / "선택해제"로 변함)
  const toggleAbsentMode = () => {
    // 미출석 모드 토글 시 bulk 선택 초기화
    setBulkAbsentSelection([]);
    setBulkAbsentComment("");
    setIsAbsentMode((prev) => !prev);
  };

  // bulk로 선택된 학생들에게 입력한 comment를 일괄 적용
  const handleBulkConfirm = () => {
    if (bulkAbsentComment.trim() === "") return; // 사유가 없으면 아무 동작 안 함
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
  };
  // 이미 미출석 처리된 학생의 comment 제거 (출석 전환 가능)
  const removeAbsentComment = (studentnumber: string) => {
    setState((prev) =>
      prev.map((s) =>
        s.studentnumber === studentnumber
          ? { ...s, check: undefined, comment: undefined }
          : s
      )
    );
  };

  // 미출석 모드에서, 이미 state 또는 bulk에 있는 학생은 버튼 비활성화
  const isStudentDisabled = (student: Student) => {
    const existsInState = state.find((s) => s.id === student.id);
    const existsInBulk = bulkAbsentSelection.find(
      (s) => s.studentnumber === student.studentnumber
    );

    if (isAbsentMode) {
      return Boolean(existsInState || existsInBulk);
    }
    return existsInState ? true : false;
  };
  const handleAbsentClick = (student: Student) => {
    if (isAbsentMode) {
      setBulkAbsentSelection((prev) => prev.filter((s) => s !== student));
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
                <div>
                  {/* 전체 선택 버튼 (일반 모드에서만 작동) */}
                  <button
                    className="studentNum-button"
                    onClick={handleSetStateAll}
                    disabled={isAbsentMode}
                  >
                    {state.length === props.length ? "전체해제" : "전체선택"}
                  </button>
                  <button
                    onClick={toggleView}
                    className="studentNum-button-show"
                  >
                    {viewByName ? "번호 보기" : "이름 보기"}
                  </button>
                  {/* 미출석 선택기 토글 버튼 */}
                  <button
                    onClick={toggleAbsentMode}
                    className={
                      isAbsentMode
                        ? "studentNum-button-pink"
                        : "studentNum-button-green"
                    }
                  >
                    {isAbsentMode ? "선택해제" : "미출석 선택기"}
                  </button>
                </div>
              </div>
              <div className="slider">
                {/* 이미 선택(출석 혹은 미출석 확정)된 학생들 */}
                <div style={state.length > 0 ? {} : { display: "none" }}>
                  <h3
                    className="modalTitle margin0 "
                    style={{ marginBottom: "5px" }}
                  >
                    출석 완료
                  </h3>
                  {state.map((item) => (
                    <button
                      className="studentNum-button"
                      style={{
                        backgroundColor: `${
                          item.comment ? "rgb(201, 99, 125)" : "#59ad5c"
                        }`,
                      }}
                      onClick={() => {
                        if (!item.comment) handleStudentClick(item);
                      }}
                      key={item.studentnumber}
                    >
                      {viewByName ? item.name : item.studentnumber}{" "}
                      {item.comment && `(미출석)`}
                    </button>
                  ))}
                </div>
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
                {/* 미출석 모드일 경우, 선택된 학생 목록과 comment 입력 영역 노출 */}
                {isAbsentMode && (
                  <div className="notat-comment">
                    <h3 className="margin0" style={{ marginBottom: "10px" }}>
                      선택됨
                    </h3>
                    {bulkAbsentSelection.length > 0 ? (
                      bulkAbsentSelection.map((student) => (
                        <button
                          className=" studentNum-button-pink"
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
                {/* 미출석 처리된 학생 목록 (확정된 학생들) */}
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
              <div>
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
