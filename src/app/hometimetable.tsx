"use client";

import React, { useState, useEffect } from "react";
import getschedules from "./scripts/getschedules";

interface ScheduleItem {
  status: string;
  grade: string;
  class: string;
  date: string;
  data?: any[];
  dayofweek: number;
}

export default function Meals() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const date = new Date();

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
    setSchedules(scheduleData);

    // 데이터를 로컬 스토리지에 저장
    localStorage.setItem("schedules", JSON.stringify(scheduleData));
  }
  const today = date.getDay();
  const todayMeals = schedules.filter(
    (schedule) => schedule.dayofweek === today
  );

  if (todayMeals.length === 0) {
    return (
      <div className="home-dish-list">
        <p>
          이런! 시간표 정보가 없네요
          <br />
          아마 쉬는 날이 아닐까요?
        </p>
      </div>
    );
  }

  return (
    <>
      {todayMeals.map((meal, index) => (
        <div key={index}>
          {Array.isArray(meal.data) && meal.data.length > 0 ? (
            <div className="home-dish-list">
              {meal.data.map((dish, i) =>
                i % 4 === 0 ? (
                  <div key={i} className="dish-group">
                    {[
                      meal.data[i],
                      meal.data[i + 1],
                      meal.data[i + 2],
                      meal.data[i + 3],
                    ].map((d, j) => d && <p key={j}>{d} #</p>)}
                  </div>
                ) : null
              )}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}
