"use client";
import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import dayjs from "dayjs";
import axios from "axios";
import { time } from "console";

export default function FourDigitCodeInput() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [currenttime, setCurrentTime] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // 숫자만 입력 가능
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    inputRefs.current[index + 1]?.focus();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("A h:mm:ss"));
      setFormattedTime(dayjs().format("HH:mm"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && index < 3) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Backspace" && index === 3 && code[3] === "") {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Backspace" && index === 3 && code[3] !== "") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (code.every((digit) => digit !== "")) {
      try {
        axios
          .patch("/api/post/vacAT/page3", {
            studentnumber: code.join(""),
            outTime: formattedTime,
          })
          .then((response) => {
            if (response.status === 200) {
              alert(`${response.data.message}`);
            } else {
              alert(`${response.data.message}`);
            }
          });
      } catch (error) {
        alert("오류가 발생했습니다 / 새로고침 해주세요");
      } finally {
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } else {
      alert("모든 칸에 숫자를 입력해주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "10rem",
        paddingRight: "10rem",
        height: "100vh",
      }}
    >
      <div>
        <div className="time">{currenttime}</div>
        <div className="formatted-time">{formattedTime}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <h2 style={{ marginBottom: "3px" }}>방학 자습 입장</h2>
        <h5 className="subtitle" style={{ marginTop: "3px" }}>
          학번을 입력해주세요
        </h5>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {code.map((digit, index) => (
            <input
              key={index}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="input-code"
            />
          ))}
        </div>
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
            width: "15vw",
            minWidth: "100px",
            height: "50px",
            borderRadius: "1rem",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
          onClick={handleSubmit}
          className="ok-button"
        >
          퇴장하기
        </button>
      </div>
    </div>
  );
}
