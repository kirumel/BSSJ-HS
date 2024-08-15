"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Define the types for the data objects
interface DataItem {
  id: string;
  createdAt: string;
  name: string;
  check: string;
  comment: string;
  author: string;
}

interface Difference {
  id: string;
  name: string;
  beforeCheck: string;
  afterCheck: string;
}

export default function CompareAT() {
  const [firstdata, setFirstdata] = useState<DataItem[]>([]);
  const [afterdata, setAfterdata] = useState<DataItem[]>([]);
  const [differences, setDifferences] = useState<Difference[]>([]);

  useEffect(() => {
    // 클라이언트 측에서만 실행되므로, 여기서 localStorage에 접근합니다.
    const storedData = localStorage.getItem("compareAT");
    if (storedData) {
      try {
        setFirstdata(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    axios
      .get<{ data: string }>("/api/post/compareAT")
      .then((response) => {
        if (response.status === 200) {
          try {
            setAfterdata(JSON.parse(response.data.data));
          } catch (error) {
            console.error("Error parsing server response:", error);
          }
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from server:", error);
      });
  }, []);

  useEffect(() => {
    // `firstdata`와 `afterdata`를 비교하여 check 속성의 차이를 찾습니다.
    const findDifferences = (): Difference[] => {
      if (firstdata.length === 0 || afterdata.length === 0) return [];

      // Create a map of afterdata by ID for easy lookup
      const afterDataMap = new Map<string, DataItem>(
        afterdata.map((item) => [item.id, item])
      );

      return firstdata
        .map((item) => {
          const afterItem = afterDataMap.get(item.id);
          if (afterItem && item.check !== afterItem.check) {
            return {
              id: item.id,
              name: item.name,
              beforeCheck: item.check,
              afterCheck: afterItem.check,
            };
          }
          return null;
        })
        .filter((item): item is Difference => item !== null);
    };

    setDifferences(findDifferences());
  }, [firstdata, afterdata]);

  return (
    <>
      <div>
        <h2>출석결과</h2>

        <ul>
          {differences.length > 0 ? (
            differences.map((diff) => (
              <li key={diff.id}>
                <strong>{diff.name}</strong>:
                <span>
                  {" "}
                  Before: {diff.beforeCheck} | After: {diff.afterCheck}
                </span>
              </li>
            ))
          ) : (
            <p>No differences found</p>
          )}
        </ul>
      </div>
    </>
  );
}
