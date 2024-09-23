"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "./style.css";

// Defining types for session and API response
interface SessionUser {
  class: string;
  grade: string;
}

interface SessionData {
  user: SessionUser;
}

interface DataItem {
  updatedAt: string;
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
    console.log(afterdata);
    if (firstdata.length > 0 || afterdata.length > 0) {
      if (!afterdata || afterdata.length === 0) {
        toast(
          "2차 출석에 반 학생들이 등록되어있지 않거나 데이터를 찾을 수 없습니다"
        );
      } else if (firstdata[0]?.updatedAt === afterdata[0]?.updatedAt) {
        window.location.href = "/compareAT";
      } else {
        toast("1차 출석과 2차 출석의 일자가 다르거나");
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
  }, []);

  useEffect(() => {
    const fetchAfterData = async (): Promise<void> => {
      try {
        const response = await axios.get<{ data: string }>(
          "/api/post/compareAT",
          {
            params: {
              grade: session?.user?.grade,
            },
          }
        );

        if (response.status === 200) {
          const afterdata = JSON.parse(response.data[0].data) as DataItem[];
          const filteredData = afterdata.filter(
            (item) =>
              item.class === session?.user?.class &&
              item.grade === session?.user?.grade
          );

          setAfterdata(filteredData);
        } else {
          console.log(
            "데이터를 불러오는데 오류가 발생하였습니다",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };

    fetchAfterData();
  }, [session]);

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
