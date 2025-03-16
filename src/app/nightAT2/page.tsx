"use client";
import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import dayjs from "dayjs";
import axios from "axios";
import QrScanner from "qr-scanner"; // QR 스캐너 라이브러리

export default function FourDigitCodeInput() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [currenttime, setCurrentTime] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
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

  // QR 스캐너 설정
  useEffect(() => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("decoded qr code:", result);
          setQrCodeData(result.data);
        },
        {
          returnDetailedScanResult: true,
        }
      );
      scanner.start();
      console.log(qrCodeData);

      return () => scanner.stop();
    }
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
        const studentNumber = code.join("");
        const response = await axios.get("/api/getStudentCode", {
          params: { studentnumber: studentNumber },
        });

        if (response.status === 200 && response.data.code) {
          if (response.data.code === qrCodeData) {
            await axios.patch("/api/post/nightAT/page", {
              studentnumber: studentNumber,
              outTime: formattedTime,
            });
            alert("출석 확인되었습니다.");
          } else {
            alert("QR 코드가 일치하지 않습니다. 출석 실패.");
          }
        } else {
          alert("등록된 학번이 없습니다.");
        }
      } catch (error) {
        alert("오류가 발생했습니다. 새로고침 해주세요.");
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
        <h2 style={{ marginBottom: "3px" }}>야자 퇴장</h2>
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
        <video
          ref={videoRef}
          style={{ width: "200px", height: "200px", marginTop: "20px" }}
        />
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
            width: "15vw",
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
