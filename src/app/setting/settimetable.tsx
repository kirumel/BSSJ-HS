"use client";

import React, { useState, useEffect } from "react";
import getschedules from "../scripts/getschedules";

interface ScheduleItem {
  status: string;
  grade: string;
  class: string;
  date: string;
  data?: any[];
}

export default function Meals(props: any) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const day = ["월", "화", "수", "목", "금"];

  useEffect(() => {
    const storedSchedules = localStorage.getItem("schedules");

    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    } else {
      fetchSchedules();
    }
  }, []);

  // API에서 시간표 데이터 가져오기
  async function fetchSchedules() {
    const scheduleData = await getschedules();

    const schedulesWithEmptySlots = scheduleData.map((schedule) => {
      if (schedule.status === "error" || schedule.status === "정보없음") {
        return {
          ...schedule,
          data: ["", "", "", "", "", "", ""],
          status: "empty",
        };
      }
      return schedule;
    });
    setSchedules(schedulesWithEmptySlots);

    // 데이터를 로컬 스토리지에 저장
    localStorage.setItem("schedules", JSON.stringify(schedulesWithEmptySlots));
  }

  // 슬롯을 수정하는 함수
  const handleSlotEdit = (
    dayIndex: number,
    subjectIndex: number,
    newValue: string
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex].data![subjectIndex] = newValue; // 새 값으로 업데이트
    setSchedules(updatedSchedules);

    // 수정된 데이터를 로컬 스토리지에 저장
    localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
  };

  return (
    <div className="home-layout">
      <div className="main-container etc-container" style={{ margin: "1rem" }}>
        <div className="subject-title">
          <div>
            <h2 style={{ margin: "2px" }}>{props.name}님의</h2>
            <h5 style={{ margin: "2px" }}>시간표 🕒📖</h5>
          </div>
          <button className="subject-button" onClick={fetchSchedules}>
            초기화
          </button>
        </div>
        <div style={{ marginTop: "30px" }} className="subject-row ">
          {schedules.map((schedule, dayIndex) => (
            <div key={dayIndex} className="subject">
              <div className="slot1">{day[dayIndex]}</div>
              {schedule.data &&
                schedule.data.map((subject, subjectIndex) => (
                  <div
                    className="slot"
                    key={subjectIndex}
                    onDoubleClick={() => {
                      const newValue =
                        prompt("시간표를 입력해주세요!", subject) || subject;
                      handleSlotEdit(dayIndex, subjectIndex, newValue); // 수정된 값 적용
                    }}
                  >
                    {subject}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
