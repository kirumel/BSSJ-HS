"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    alert("권환 오류! 다시 로그인 해주세요");
  }
  if (session?.user?.role !== "SjAdMin") {
    router.push("/");
    alert("관리자 권환이 없습니다");
  }
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "#1A1A1A",
          height: "100vh",
        }}
      >
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
            <Link href="compareAT">
              <button
                style={{ backgroundColor: "#9A9AF6" }}
                className="event-box-button"
              >
                8교시 <br />
                출석 대조
              </button>
            </Link>
          </div>

          <div className="event-box-container">
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
              출석 대조
            </button>
          </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
