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

  useEffect(() => {
    async function fetchMeals() {
      const mealsData = await getonemeal();
      setMeals(mealsData);
    }
    fetchMeals();

    async function fetchMeals2() {
      const mealsData = await getonemeal2();
      setMeals2(mealsData);
    }
    fetchMeals2();
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
                  {meal.data.map((dish, i) =>
                    i % 4 === 0 ? (
                      <div key={i} className="dish-group">
                        {[
                          meal.data?.[i],
                          meal.data?.[i + 1],
                          meal.data?.[i + 2],
                          meal.data?.[i + 3],
                        ].map((d, j) => d && <p key={j}>{d} #</p>)}
                      </div>
                    ) : null
                  )}
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
                        {meal.data.map((dish, i) =>
                          i % 4 === 0 ? (
                            <div key={i} className="dish-group">
                              {[
                                meal.data?.[i],
                                meal.data?.[i + 1],
                                meal.data?.[i + 2],
                                meal.data?.[i + 3],
                              ].map((d, j) => d && <p key={j}>{d} #</p>)}
                            </div>
                          ) : null
                        )}
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
