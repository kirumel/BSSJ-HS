"use client";
import "./style.css";
import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";

const targetDate = dayjs("2024-10-17");
const today = dayjs();
const dDay = targetDate.diff(today, "day");

type Subject = "국어" | "영어" | "수학" | "사회" | "과학" | "기타";
type Records = Record<Subject, number>;

const formatTime = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / 60000); // 분
  const seconds = Math.floor((milliseconds % 60000) / 1000); // 초
  const millis = Math.floor((milliseconds % 1000) / 10); // 밀리초 (두 자리 표시)

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}.${String(millis).padStart(2, "0")}`;
};

const Home: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [records, setRecords] = useState<Records>({
    국어: 0,
    영어: 0,
    수학: 0,
    사회: 0,
    과학: 0,
    기타: 0, // 과목이 선택되지 않았을 때 기록을 추가할 항목
  });
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [totalHours2, setTotalHours2] = useState(0);
  const [totalTime, setTotalTime] = useState(0); // 총합 시간
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 10;
          if (Math.floor(newTime / 60000) >= 60) {
            setTotalHours((prevHours) => prevHours + 1);
            return newTime % 3600000;
          }
          if (currentSubject) {
            setRecords((prevRecords) => ({
              ...prevRecords,
              [currentSubject]: prevRecords[currentSubject] + 10,
            }));
          } else {
            setRecords((prevRecords) => ({
              ...prevRecords,
              기타: prevRecords.기타 + 10, // 과목이 선택되지 않았을 때 "기타"에 시간 추가
            }));
          }
          return newTime;
        });
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentSubject]);

  // 실시간으로 총합 시간 계산
  useEffect(() => {
    const total = Object.values(records).reduce((acc, curr) => acc + curr, 0);
    setTotalTime(total);

    // 총합 시간에 기반해 총 시간(시)을 업데이트
    const hours = Math.floor(total / 3600000);
    setTotalHours2(hours);
  }, [records]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const stop = () => {
    setIsRunning(false);
    setTime(0);
  };

  const selectSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsRunning(true);
  };

  // 그래프의 최대 시간 계산
  const maxTime = Math.max(...Object.values(records));

  // 시간 순서대로 정렬된 데이터를 반환
  const sortedRecords = Object.entries(records)
    .sort((a, b) => b[1] - a[1]) // 내림차순 정렬
    .map(([subject, time]) => ({ subject, time }));

  return (
    <>
      <div className="main-container study-top-display">
        <div className="day-box">
          <p>시험까지 📖</p>
          <p className="day">D - {dDay}</p>
        </div>

        <div className="pad-display-none time-box">
          <p className="studybar-top-title">{formatTime(totalTime)}</p>
          <p className="studybar-top-subtitle">현제: {formatTime(time)}</p>
          <div className="buttons-top ">
            <button className="start-button" onClick={start}>
              시작
            </button>
            <button className="pause-button" onClick={pause}>
              일시정지
            </button>
            <button className="stop-button" onClick={stop}>
              중지
            </button>
          </div>
        </div>
      </div>
      <div className="pad-display-none">
        <div className="study-buttons">
          <button onClick={() => selectSubject("국어")}>국어</button>
          <button onClick={() => selectSubject("영어")}>영어</button>
          <button onClick={() => selectSubject("수학")}>수학</button>
          <button onClick={() => selectSubject("사회")}>사회</button>
          <button onClick={() => selectSubject("과학")}>과학</button>
          <button onClick={() => setCurrentSubject(null)}>기타 과목</button>
        </div>
      </div>
      <div className="line"></div>
      <div>
        <div className="phone-display-none">
          <div>
            <p>시: {totalHours > 0 && `${totalHours} 시간`}</p>
            <h1 className="studybar-title">{formatTime(totalTime)}</h1>
            <p className="studybar-subtitle">현재: {formatTime(time)}</p>
          </div>
        </div>

        <div className="phone-display-none">
          <div className="buttons">
            <button className="start-button" onClick={start}>
              시작
            </button>
            <button className="pause-button" onClick={pause}>
              일시정지
            </button>
            <button className="stop-button" onClick={stop}>
              중지
            </button>
          </div>
        </div>
        <div className="phone-display-none">
          <div className="study-buttons">
            <button onClick={() => selectSubject("국어")}>국어</button>
            <button onClick={() => selectSubject("영어")}>영어</button>
            <button onClick={() => selectSubject("수학")}>수학</button>
            <button onClick={() => selectSubject("사회")}>사회</button>
            <button onClick={() => selectSubject("과학")}>과학</button>
            <button onClick={() => setCurrentSubject(null)}>기타 과목</button>
          </div>
        </div>
        <div className="phone-display-none line"></div>

        <div className="main-container">
          {sortedRecords.map(({ subject, time }) => (
            <div key={subject} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: time > 0 ? "block" : "none",
                }}
              >
                {subject}
              </div>
              <div className="studybar-container">
                <div
                  className="studybar"
                  style={{
                    width: `${time > 0 ? (time / maxTime) * 100 : 0}%`,
                    padding: time > 0 ? "10px" : "0",
                  }}
                >
                  <p
                    style={{
                      display: time > 0 ? "block" : "none",
                    }}
                    className="studybar-text"
                  >
                    {formatTime(time)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="margin"></div>
    </>
  );
};

export default Home;
