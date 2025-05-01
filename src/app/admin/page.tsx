"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Slide, ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import "./admin.css";
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
export default function Page() {
  const { data: session } = useSession();
  const [firstdata, setFirstdata] = useState<DataItem[]>([]);
  const [afterdata, setAfterdata] = useState<DataItem[]>([]);
  const [currenttime, setCurrentTime] = useState<string>("");
  const router = useRouter();
  const [Status, setStatus] = useState();
  if (!session) {
    alert("권환 오류! 다시 로그인 해주세요");
  }
  if (session?.user?.role !== "SjAdMin") {
    router.push("/");
    alert("관리자 권환이 없습니다");
  }
  function handleATcompare() {
    console.log(afterdata);
    console.log(firstdata);
    if (
      !firstdata ||
      (firstdata.length === 0 && !afterdata) ||
      afterdata.length === 0
    ) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html:
              "1,2차 출석이 완료되지 않았거나<br/>데이터를 찾을 수 없습니다",
          }}
        />
      );
    } else if (!afterdata || afterdata.length === 0) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html:
              "2차 출석이 완료되지 않았거나<br/>데이터를 찾을 수 없습니다",
          }}
        />
      );
    } else if (!firstdata || firstdata.length === 0) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html:
              "1차 출석이 완료되지 않았거나<br/>데이터를 찾을 수 없습니다",
          }}
        />
      );
    } else if (firstdata.length > 0 || afterdata.length > 0) {
      if (firstdata[0]?.updatedAt === afterdata[0]?.updatedAt) {
        window.location.href = "/compareAT";
      } else {
        toast.error(
          <div
            dangerouslySetInnerHTML={{
              __html:
                "1차 출석과 2차 출석의 일자가 다르거나 <br />완료되지 않았습니다",
            }}
          />
        );
      }
    } else {
      toast.error("알 수 없는 오류입니다");
    }
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("A h:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  });

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
    fetch("/api/takeAT") // 실제 API 경로로 변경
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
      })
      .then((data) => {
        setStatus(data.fileStatus);
      });
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
    <div style={{ overflow: "hidden" }}>
      <div>
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
        <div className="admin-mainTop">
          <div className="event-text-container">
            <p className="event-text-title">
              {session?.user?.name} / {session?.user?.grade}학년{" "}
              {session?.user?.class}반
            </p>
            <p className="event-text" style={{ fontSize: "12px" }}>
              공지 : 8교시 하지 않는 학생은 삭제해주세요
            </p>
            <a href="/adminfeed">
              <button className="event-feed">feed 등록하기</button>
            </a>
          </div>
          <div className="pad-display-none admin-time">{currenttime}</div>
        </div>
        <div className="line" style={{ marginTop: "10px" }}></div>
        <div className="admin-mainMiddle">
          <Link href="/studentobject">
            <button style={{ width: "100%" }}>출석 학생관리</button>
          </Link>
          <Link href="/cafe/boardSetting">
            <button style={{ width: "100%" }}>게시판 관리</button>
          </Link>
          {/* <button>이벤트 관리</button> */}
        </div>
        <div className="line" style={{ marginTop: "10px" }}></div>

        <div className="admin-mainBottom">
          <div className="display-flex" style={{ alignItems: "flex-start" }}>
            <p className="admin-title">8교시 출석 / beta 3.0</p>
            <div className="admin-AT">
              {["1", "2", "3"].map((data, i) => (
                <div className="admin-AT-container" key={i}>
                  <div
                    className="admin-AT-circle"
                    style={{
                      backgroundColor: Status?.[`grade${i + 1}`]
                        ? "green"
                        : "red",
                    }}
                  ></div>
                  <div
                    className="admin-title"
                    style={{
                      paddingLeft: "5px",
                      margin: "0px",
                      fontSize: "11px",
                    }}
                  >
                    {parseInt(data)}학년 / {""}
                    {Status?.[`grade${i + 1}`] ? "출석 완료" : "출석 안 됨"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="event-box-container">
            <Link href="/attendance">
              <button
                style={{ backgroundColor: "#5656E3" }}
                className="event-box-button"
              >
                8교시 <br />
                출석
              </button>
            </Link>
            <Link href="choiceATgrade">
              <button
                style={{ backgroundColor: "#9A9AF6" }}
                className="event-box-button"
              >
                8교시 <br />
                감독
              </button>
            </Link>
            <button
              style={{ backgroundColor: "#9A9AF6" }}
              className="event-box-button"
              onClick={handleATcompare}
            >
              8교시 <br />
              대조
            </button>{" "}
          </div>
          <div className="line"></div>
          <div className="display-flex" style={{ alignItems: "flex-start" }}>
            <p className="admin-title">야자 출석 / 이용가능</p>
            {""}
            <div className="admin-AT">
              {["1", "2", "3"].map((data, i) => (
                <div className="admin-AT-container" key={i}>
                  <div
                    className="admin-AT-circle"
                    style={{
                      backgroundColor: Status?.[`compareATNight${i + 1}`]
                        ? "green"
                        : "red",
                    }}
                  ></div>
                  <div
                    className="admin-title"
                    style={{
                      paddingLeft: "5px",
                      margin: "0px",
                      fontSize: "11px",
                    }}
                  >
                    {parseInt(data)}학년 / {""}
                    {Status?.[`compareATNight${i + 1}`]
                      ? "출석 완료"
                      : "출석 안 됨"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="event-box-container">
            <Link href="/nightattendance">
              <button
                style={{ backgroundColor: "#F06196" }}
                className="event-box-button"
              >
                야자 <br />
                출석
              </button>
            </Link>
            <Link href="choiceNightATgrade">
              <button
                style={{ backgroundColor: "#F495B9" }}
                className="event-box-button"
              >
                야자 <br />
                감독
              </button>
            </Link>
            <Link href="/choiceNightAT">
              <button
                style={{ backgroundColor: "#F495B9" }}
                className="event-box-button"
              >
                퇴장 <br />
                시간
              </button>
            </Link>
            <Link href="/night">
              <button
                style={{ backgroundColor: "#F495B9" }}
                className="event-box-button"
              >
                출석부 <br />
                만들기
              </button>
            </Link>
          </div>
          <div className="admin-AT">
            {["1", "2", "3"].map((data, i) => (
              <div className="admin-AT-container" key={i}>
                <div
                  className="admin-AT-circle"
                  style={{
                    backgroundColor: Status?.[`night${i + 1}`]
                      ? "green"
                      : "red",
                  }}
                ></div>
                <div
                  className="admin-title"
                  style={{
                    paddingLeft: "5px",
                    margin: "0px",
                    fontSize: "11px",
                  }}
                >
                  {parseInt(data)}학년 / {""}
                  {Status?.[`night${i + 1}`] ? "생성 완료" : "생성 안 됨"}
                </div>
              </div>
            ))}
          </div>
          <div className="line"></div>
          <p className="admin-title">기타항목</p>
          <div className="event-box-container">
            <Link href="https://drive.google.com/file/d/1ltVQod1J7o7irWRV0SkRyuGsWQl2SS3H/view?usp=sharing">
              <button className="event-box-button" style={{ color: "black" }}>
                설명서 <br />
                다운
              </button>
            </Link>
            <Link href="attendanceDB">
              <button className="event-box-button" style={{ color: "black" }}>
                출석부 <br />
                목록
              </button>
            </Link>

            <Link href="delFile">
              <button className="event-box-button" style={{ color: "black" }}>
                출석 <br />
                취소 <br />
              </button>
            </Link>
            <Link href="takeAT">
              <button className="event-box-button" style={{ color: "black" }}>
                출석 <br />
                현황 <br />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="margin"></div>
    </div>
  );
}
