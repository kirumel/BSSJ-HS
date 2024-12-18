"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Slide, ToastContainer, toast } from "react-toastify";
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
  const router = useRouter();
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
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "#1A1A1A",
          height: "100vh",
        }}
      >
        {" "}
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
        <div className="nav">
          <Link href="/">
            <Image src={logo} alt="logo" width={71} height={25} />
          </Link>
        </div>
        <div className="line" style={{ backgroundColor: "#222123" }}></div>
        <div className="event-text-container">
          <p className="event-text-title">
            안녕하세요 {session?.user?.name}님!
          </p>
          <p className="event-text">여기는 관리자 탭입니다</p>
          <a href="/adminfeed">
            <button className="event-feed">feed 등록하기</button>
          </a>
        </div>
        <div>
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
                감독관
              </button>
            </Link>

            <button
              style={{ backgroundColor: "#9A9AF6" }}
              className="event-box-button"
              onClick={handleATcompare}
            >
              8교시 <br />
              출석대조
            </button>
          </div>

          {/* <div className="event-box-container">
            <button
              style={{ backgroundColor: "#F06196" }}
              className="event-box-button"
            >
              야자 <br />
              출석
            </button>
            <button
              style={{ backgroundColor: "#F495B9" }}
              className="event-box-button"
            >
              야자 <br />
              감독관
            </button>
            <button
              style={{ backgroundColor: "#F495B9" }}
              className="event-box-button"
            >
              야자 <br />
              출석대조
            </button>
          </div> */}

          <div className="event-box-container">
            <Link href="attendanceDB">
              <button className="event-box-button" style={{ color: "black" }}>
                출석부 <br />
                다운
              </button>
            </Link>
            <button style={{ color: "black" }} className="event-box-button">
              이벤트 <br />
              등록
            </button>
            <Link href="sessiondelete">
              <button style={{ color: "black" }} className="event-box-button">
                학생 <br />밴
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
