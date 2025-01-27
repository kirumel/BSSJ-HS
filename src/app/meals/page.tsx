"use client";

import React, { useState, useEffect } from "react";
import { getMeal } from "../scripts/getmeal";

interface time {
  status: string;
  date: string;
  data?: string[];
}

export default function Meals() {
  const [meals, setMeals] = useState<time[]>([]);
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 추가: 로딩 상태

  useEffect(() => {
    async function fetchMeals() {
      setIsLoading(true);
      const mealsData = await getMeal();
      setMeals(mealsData);
      setIsLoading(false);
    }
    fetchMeals();
  }, []);

  const nextDate = () => {
    setCurrentDateIndex(currentDateIndex + 1);
  };

  const beforeDate = () => {
    setCurrentDateIndex(currentDateIndex - 1);
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
      {meals.map((meal, index) =>
        index == currentDateIndex ? (
          <div className="dish" key={index}>
            <div className="dish-box">
              <h2 className="dish-date">{meal.date}</h2>
              <p className="dish-icon">🍚</p>
            </div>
            {Array.isArray(meal.data) ? (
              <div className="dish-list">
                {meal.data.map((dish, i) => (
                  <p key={i}># {dish}</p>
                ))}
              </div>
            ) : (
              <div className="dish-list">
                <p>
                  이런! 급식 정보가 없네요
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
        disabled={currentDateIndex === meals.length - 1}
      >
        &gt;
      </button>
    </div>
  );
}
