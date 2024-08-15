"use client";

import React, { useState, useEffect } from "react";
import { getonemeal } from "./scripts/getonemeal";

interface time {
  status: string;
  date: string;
  data?: string[];
}

export default function Meals() {
  const [meals, setMeals] = useState<time[]>([]);

  useEffect(() => {
    async function fetchMeals() {
      const mealsData = await getonemeal();
      setMeals(mealsData);
    }
    fetchMeals();
  }, []);

  return (
    <>
      {meals.map((meal, index) => (
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
          ) : (
            <div className="home-dish-list">
              <p>
                이런! 급식 정보가 없네요
                <br />
                아마 쉬는 날이 아닐까요?
              </p>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
