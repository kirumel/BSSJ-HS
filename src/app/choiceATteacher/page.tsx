"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "./style.css";

interface DataItem {
  updatedAt: any;
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

export default function ChoiceAT() {
  const [firstdata, setFirstdata] = useState<DataItem[]>([]);
  const [afterdata, setAfterdata] = useState<DataItem[]>([]);
  const { data: session } = useSession();

  function handleATcompare() {
    if (firstdata.length > 0 && afterdata.length > 0) {
      if (firstdata[0].updatedAt === afterdata[0].updatedAt) {
        window.location.href = "/compareAT";
      } else {
        toast("1차 출석과 2차 출석의 일자가 달라요!");
      }
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem("compareAT");
    if (storedData) {
      try {
        setFirstdata(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []); // Run once on mount to load firstdata

  useEffect(() => {
    const fetchAfterData = async (session: any): Promise<DataItem[]> => {
      try {
        const response = await axios.get<{ data: string }>(
          "/api/post/compareAT"
        );
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
        }
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
      return []; // Return an empty array in case of an error
    };

    if (session && firstdata.length > 0) {
      // Fetch after data only when session and firstdata are available
      fetchAfterData(session).then((data) => {
        if (data) {
          setAfterdata(data);
        }
      });
    }
  }, [session, firstdata]); // Only run when session or firstdata change

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        closeButton={false}
      />
      <div className="dish-display">
        <div className="main-container">
          <h3 className="home-title padding-right-left">출석 및 확인하기</h3>
          <div className="main-container-display">
            <div className="main-container-50">
              <div className="etc-container display-flex">
                <Link href="/attendance">
                  우리반 학생들 <br /> 1차 출석하기
                </Link>
              </div>
            </div>
            <div className="main-container-50">
              <div className="etc-container display-flex">
                <button className="compareAT-button" onClick={handleATcompare}>
                  감독관 결과 <br />
                  확인하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
