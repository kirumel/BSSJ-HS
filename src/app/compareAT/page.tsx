"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import "../attendance/style.css";

import "./style.css";

// Define the types for the data objects
interface DataItem {
  id: string;
  createdAt: string;
  name: string;
  check: string;
  grade: string;
  class: string;
  studentnumber: string;
  comment: string;
  author: string;
}

interface Difference {
  id: string;
  name: string;
  beforeCheck: string;
  afterCheck: string;
  grade: string;
  class: string;
  studentnumber: string;
}

const fetchAfterData = async (session: any): Promise<DataItem[]> => {
  try {
    const response = await axios.get<{ data: string }>("/api/post/compareAT");
    if (response.status === 200) {
      const afterdata = JSON.parse(response.data.data);
      const filteredData = afterdata.filter(
        (item: DataItem) =>
          item.class === session?.user?.class &&
          item.grade === session?.user?.grade
      );
      const data = filteredData.map((item: DataItem) => ({
        ...item,
        check: item.check === "2" ? "0" : item.check,
      }));

      return data;
    } else {
      alert(response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data from server:", error);
    return [];
  }
};

const calculateDifferences = (
  firstdata: DataItem[],
  afterdata: DataItem[]
): Difference[] => {
  if (firstdata.length === 0 || afterdata.length === 0) return [];

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
          grade: item.grade,
          class: item.class,
          studentnumber: afterItem.studentnumber,
        };
      }
      return null;
    })
    .filter((item): item is Difference => item !== null);
};

export default function CompareAT() {
  const { data: session } = useSession();
  const [firstdata, setFirstdata] = useState<DataItem[]>([]);
  const [afterdata, setAfterdata] = useState<DataItem[]>([]);
  const [differences, setDifferences] = useState<Difference[]>([]);
  const [nodifferences, setNodifferences] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session) {
      fetchAfterData(session).then((data) => {
        setAfterdata(data);
        setLoading(false); // Set loading to false once data is fetched
      });
    }
  }, [session]);

  useEffect(() => {
    const storedData = localStorage.getItem("compareAT");
    if (storedData) {
      try {
        setFirstdata(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const calculatedDifferences = calculateDifferences(firstdata, afterdata);
      setDifferences(calculatedDifferences);

      const differenceIds = new Set(
        calculatedDifferences.map((diff) => diff.id)
      );
      const filteredData = afterdata.filter(
        (item) => !differenceIds.has(item.id)
      );
      setNodifferences(filteredData);
    }
  }, [firstdata, afterdata, loading]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="right-left-margin">
      <h2 style={{ marginBottom: "0" }}>출석결과</h2>
      <p style={{ margin: "0" }} className="subtitle">
        출석 결과를 알아볼 수 있습니다
      </p>
      <div className="attendance-container">
        {differences.map((diff, index) => (
          <div
            className="attendance-student"
            style={{
              backgroundColor: "#FFE8E8",
              animationDelay: `${index * 100}ms`,
            }}
            key={diff.id}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="attendance-student-title-display">
                <div className="attendance-student-title">
                  <p className="attendance-student-name">{diff.name}</p>
                  <p className="attendance-student-gradeandclass">
                    {diff.grade}학년 {diff.class}반
                  </p>
                </div>
                <p className="attendance-student-number">
                  {diff.studentnumber}번
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {diff.beforeCheck === "1" ? "출석" : "미출석"} -&gt; {""}
                {diff.afterCheck === "1" ? "출석" : "미출석"}
              </div>
            </div>
          </div>
        ))}
        {nodifferences.map((student, index) => (
          <div
            className="attendance-student"
            style={{
              backgroundColor: "#E8E8E8",
              animationDelay: `${index * 100 + 100}ms`,
            }}
            key={student.id}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="attendance-student-title-display">
                <div className="attendance-student-title">
                  <p className="attendance-student-name">{student.name}</p>
                  <p className="attendance-student-gradeandclass">
                    {student.grade}학년 {student.class}반
                  </p>
                </div>
                <p className="attendance-student-number">
                  {student.studentnumber}번
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {student.check === "1" ? "출석" : "미출석"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
