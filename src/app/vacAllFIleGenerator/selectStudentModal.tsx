import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./style.css";

export default function Page(props: any) {
  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  const handleConfirm = () => {
    closeModal();
  };

  const modalAnimation = useSpring({
    transform: `translateY(${isModalOpen ? dragY : 100}%)`,
    opacity: isModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
    onRest: () => {
      if (!isModalOpen) {
        setIsModalVisible(false);
        // 모달 닫힐 때 미출석 모드와 관련 선택/사유 초기화
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
      <div>
        <button
          className="plus-attendance-button"
          style={{
            color: "white",
            backgroundColor: "rgb(90, 19, 255)",
            borderRadius: "1rem",
          }}
          onClick={openModal}
        >
          리스트 보기
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
                  alignItems: "center",
                  flexDirection: "column",
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
                <div className="modal-list">
                  {props.props.map((item: any, index: number) => (
                    <div className="modal-item" key={index}>
                      {item.createdAt}
                    </div>
                  ))}
                </div>
              </div>
            </animated.div>
          </>
        )}
      </div>
    </div>
  );
}
