"use client";

import React, { useState, useEffect } from "react";
import { getonemeal } from "./scripts/getonemeal";
import { getonemeal2 } from "./scripts/getonemeal2";

interface Time {
  status: string;
  date: string;
  data?: string[];
}

export default function Meals({
  flipped,
}: {
  flipped: (flipped: boolean) => void;
}) {
  const [meals, setMeals] = useState<Time[]>([]);
  const [meals2, setMeals2] = useState<Time[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  async function fetchMeals() {
    const mealsData = await getonemeal();
    localStorage.setItem("mealData", JSON.stringify(mealsData));
    return mealsData;
  }

  async function fetchMeals2() {
    const mealsData = await getonemeal2();
    localStorage.setItem("mealData2", JSON.stringify(mealsData));
    return mealsData;
  }
  console.log(meals);

  // 초기 데이터 로드
  useEffect(() => {
    const fetch = async () => {
      const mealData = await fetchMeals();
      const mealData2 = await fetchMeals2();

      Promise.all([mealData, mealData2]).then(([mealsData, mealsData2]) => {
        setMeals(mealsData);
        setMeals2(mealsData2);
      });
    };
    fetch();
  }, []);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    flipped(!isFlipped);
  };

  return (
    <>
      {meals.map((meal, index) => (
        <div key={index} className="meal-container" onClick={handleClick}>
          <div className={`meal-card ${isFlipped ? "flipped" : ""}`}>
            <div className="meal-content front">
              {meal.data && Array.isArray(meal.data) && meal.data.length > 0 ? (
                <div className="home-dish-list">
                  {meal.data.map((dish, i) => (
                    <div key={i} className="dish-group">
                      <p>
                        <div className="dish-list-box">
                          <span className="dish-number">{i + 1}.</span>
                          {dish}
                        </div>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="home-dish-list">
                  <p>
                    이런! 중식 정보가 없네요
                    <br />
                    아마 쉬는 날이 아닐까요?
                  </p>
                </div>
              )}
            </div>

            <div className="meal-content back">
              {meals2.length > 0 ? (
                meals2.map((meal2, index2) => (
                  <div key={index2} className="home-dish-list">
                    {meal2.data && Array.isArray(meal2.data) ? (
                      <div className="home-dish-list">
                        {meal2.data.map((dish, i) => (
                          <div key={i} className="dish-group">
                            <p>
                              <div className="dish-list-box">
                                <span className="dish-number">{i + 1}.</span>
                                {"  "}
                                {"  "}
                                {dish}
                              </div>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="home-dish-list">
                        <p>
                          이런! 석식 정보가 없네요
                          <br />
                          아마 쉬는 날이 아닐까요?
                        </p>
                      </div>
                    )}
                  </div>
                ))
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
          </div>
        </div>
      ))}
    </>
  );
}
