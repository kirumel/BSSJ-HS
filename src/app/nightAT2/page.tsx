"use client";
import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import dayjs from "dayjs";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function FourDigitCodeInput() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [currenttime, setCurrentTime] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [scanAttempts, setScanAttempts] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("A h:mm:ss"));
      setFormattedTime(dayjs().format("HH:mm"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      startQRScan();
    }
  };

  const handleSubmit = async (qrCodeData: string) => {
    if (code.every((digit) => digit !== "")) {
      try {
        const studentNumber = code.join("");
        const response = await axios.get("/api/post/nightAT/getStudentCode", {
          params: { studentnumber: studentNumber },
        });

        if (response.status === 203) {
          alert("등록된 학생이 없습니다.");
          setIsScanning(false);
        }

        if (response.status === 200 && response.data.code.code) {
          if (response.data.code.code === qrCodeData) {
            await axios
              .patch("/api/post/nightAT/page", {
                studentnumber: studentNumber,
                outTime: formattedTime,
              })
              .then((response) => {
                if (response.status === 200) {
                  alert(`${response.data.message}`);
                } else {
                  alert(`${response.data.message}`);
                }
              });
            setAttempts(0);
            setCode(["", "", "", ""]);
            setIsScanning(false);
            setScanAttempts(0);
          } else {
            if (scanAttempts < 2) {
              setScanAttempts(scanAttempts + 1);
              alert(`QR 인증 실패 ${scanAttempts + 1}회차. 다시 시도해주세요.`);
            } else {
              alert("QR 코드가 일치하지 않습니다. 계정 정보를 확인해주세요.");
              setAttempts(0);
              setCode(["", "", "", ""]); // 3회 실패 시 초기화
              setScanAttempts(0);
              setIsScanning(false);
            }
          }
        } else if (response.status === 200 && !response.data.code.code) {
          alert("등록된 코드가 없습니다.");
          setIsScanning(false);
        }
      } catch (error) {
        alert("오류가 발생했습니다. 새로고침 해주세요.");
        setIsScanning(false);
      }
    } else {
      alert("모든 칸에 숫자를 입력해주세요.");
    }
  };

  const startQRScan = () => {
    if (code.every((digit) => digit !== "")) {
      setIsScanning(true);
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
        paddingLeft: "5rem",
        paddingRight: "5rem",
        height: "100vh",
      }}
    >
      <div>
        <div className="time">{currenttime}</div>
        <div className="formatted-time">{formattedTime}</div>
        {isScanning && (
          <div className="scanner">
            <Scanner
              allowMultiple={true}
              components={{ zoom: true }}
              scanDelay={3000}
              onScan={(data) => {
                if (data && data[0]?.rawValue) {
                  handleSubmit(data[0].rawValue);
                }
              }}
              onError={() => {
                alert("QR 코드 스캔 중 오류가 발생했습니다.");
                setIsScanning(false);
              }}
            />
          </div>
        )}
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
          onClick={startQRScan}
          className="ok-button"
        >
          퇴장하기
        </button>
      </div>
    </div>
  );
}
