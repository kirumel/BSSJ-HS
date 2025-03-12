"use client";

import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import animationData from "./find.json";
import "./style.css";

interface Attendance {
  name: string;
  content: string;
  check: string;
  author: string;
  grade: string;
  class: string;
  studentnumber: string;
}

export default function PlusStudentModal(props: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dragY, setDragY] = useState(0);

  const { name, content } = props; // 구조 분해 할당으로 props 사용

  const options = {
    animationData: animationData,
    loop: true,
    autoplay: true, // 자동 재생 여부
    renderer: "svg",
  };

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

  const backdropAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    config: { duration: 300 },
  });

  const openModal = () => {
    setIsModalVisible(true);
    setIsModalOpen(true);
    setDragY(0);
  };

  useEffect(() => {
    openModal();
  }, []);

  return isModalVisible ? (
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
        {...bind()} // 드래그 적용
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
          height: "38vh",
          touchAction: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "32vh",
            }}
          >
            <Lottie
              options={options}
              style={{
                position: "fixed",
                bottom: 92,
                margin: 0,
                width: "23vh",
                height: "23vh",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "130px",
              }}
            >
              <div className="success-title">{name || "제목구간"}</div>
              <div className="success-content">
                {content || "내용을 입력해주세요"}
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </>
  ) : null;
}
