"use client";
import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./write.css";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Student {
  id: any;
  studentnumber: string;
  name?: string;
  comment?: string;
  check?: string;
}

export default function Page() {
  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  const modalAnimation = useSpring({
    transform: `translateY(${isModalOpen ? dragY : 100}%)`,
    opacity: isModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
    onRest: () => {
      if (!isModalOpen) {
        setIsModalVisible(false);
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
  const { data: session } = useSession();

  const board = axios.get("/api/board/boards").then((res) => res.data);

  return (
    <div>
      <div>
        <button className="write-button" onClick={openModal}>
          작성하기
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
              <div {...bind()}></div>
              <div>
                <div className="title-div">
                  <div className="button-div">
                    <div>
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        id="check"
                      />
                      <label htmlFor="check">익명</label>
                    </div>
                    <p className="title">
                      /&nbsp; &nbsp;닉네임 : {session?.user?.nickname}
                    </p>
                  </div>

                  <div className="ok-button-div">
                    <button className="con-button">확인</button>
                  </div>
                </div>
                <div>
                  <div>
                    <input
                      className="title-input"
                      name="title"
                      placeholder="제목을 입력해주세요"
                    />
                  </div>
                  <div>
                    <textarea
                      className="content-input"
                      name="content"
                      placeholder="글내용"
                      rows={4}
                      cols={50}
                    ></textarea>
                  </div>
                  <input
                    name="nickname"
                    value={session?.user?.nickname}
                    style={{ display: "none" }}
                  />
                  <input
                    name="authorId"
                    value={session?.user?.id}
                    style={{ display: "none" }}
                  />
                </div>
                <p
                  className="subtitle"
                  style={{ fontSize: "10px", textAlign: "center" }}
                >
                  익명이 아닐 시 닉네임이 기제됩니다
                </p>
              </div>
            </animated.div>
          </>
        )}
      </div>
    </div>
  );
}
