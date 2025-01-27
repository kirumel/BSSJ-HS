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

export default function Meals() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedSchedules = localStorage.getItem("schedules");

    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    } else {
      fetchSchedules();
    }
  }, []);

  useEffect(() => {
    setCurrentDateIndex(getCurrentDayIndex());
  }, [schedules]);

  async function fetchSchedules() {
    const scheduleData = await getschedules();
    setSchedules(scheduleData);
    localStorage.setItem("schedules", JSON.stringify(scheduleData));
  }

  function getCurrentDayIndex() {
    setIsLoading(true);
    const today = new Date();
    const dayOfWeek = today.getDay();
    setIsLoading(false);

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 0;
    } else {
      return dayOfWeek - 1;
    }
  }

  const nextDate = () => {
    setCurrentDateIndex(currentDateIndex + 1);
  };

  const beforeDate = () => {
    setCurrentDateIndex(currentDateIndex - 1);
  };

  const getDateString = (currentDateIndex: number) => {
    const dateStrings = [" (월)", " (화)", " (수)", " (목)", " (금)"];
    return dateStrings[currentDateIndex] || "";
  };
  if (isLoading) {
    return (
      <div className="video-container">
        <video className="로딩" src="/로딩.mp4" autoPlay muted loop></video>
      </div>
    );
  }
  return (
    <div className="dish-display">
      <button
        className="dish-button"
        onClick={beforeDate}
        disabled={currentDateIndex === 0}
      >
        &lt;
      </button>
      {schedules.map((schedule, index) =>
        index === currentDateIndex ? (
          <div className="dish" key={index}>
            <div className="dish-box">
              <h2 className="dish-date">{getDateString(currentDateIndex)}</h2>
              <p className="dish-icon">✏️</p>
            </div>
            {Array.isArray(schedule.data) ? (
              <div className="dish-list">
                {schedule.data.map((a, i) => (
                  <p key={i}>{a}</p>
                ))}
              </div>
            ) : (
              <div className="dish-list">
                <p>
                  이런! 시간표 정보가 없네요
                  <br />
                  아마 쉬는 날이 아닐까요?
                </p>
              </div>
            )}
          </div>
        ) : null
      )}
      <button
        className="dish-button"
        onClick={nextDate}
        disabled={currentDateIndex === schedules.length - 1}
      >
        &gt;
      </button>
    </div>
  );
}
