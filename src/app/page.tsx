"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Mealcontainer from "./mealcontainer";
import Hometimetable from "./hometimetable";
import maintaps from "./maintabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Hello from "./hellohome";
import "./style.css";
import Graph from "./graph";
import School from "./school";
import Event from "./events";
import Logo from "./logo/page";
import Image from "next/image";
import { useSession } from "next-auth/react";

// NATnewCode 컴포넌트
const NATnewCode = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "lightcoral" }}>
      <h2>폰이 흔들렸습니다!</h2>
      <p>여기 새로운 코드가 보입니다!</p>
    </div>
  );
};

export default function Home() {
  const { data: session } = useSession();

  const [isShaken, setIsShaken] = useState(false);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.acceleration;

      // acceleration이 null이 아닌지 확인
      if (acc) {
        setAcceleration({
          x: acc.x || 0,
          y: acc.y || 0,
          z: acc.z || 0,
        });

        // 일정 기준 이상이면 흔들린 것으로 판단
        if (acc.x > 10 || acc.y > 10 || acc.z > 10) {
          setIsShaken(true);
        }
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleMotion);
      }
    };
  }, []);

  return (
    <>
      <div className="nav-home">
        <Link href="/">
          <Logo />
        </Link>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px", fontSize: "12px" }}>
            안녕하세요 {session?.user?.name}님!
          </div>
          <Link href="./setting" className="main-container-display">
            <img
              className="morebutton"
              src={
                session?.user?.image ||
                "https://www.studiopeople.kr/common/img/default_profile.png"
              }
              alt="Profile Image"
            />
          </Link>
        </div>
      </div>
      <div className="home-layout">
        <div>
          <Event />
        </div>
        <div className="margin-bottom-15"></div>
        <div className="main-container" style={{ paddingTop: "0" }}>
          <div className="scroll-containercenter">
            <div className="scroll-container">
              <div className="scroll-list">
                {maintaps.map((tab, index) => (
                  <a
                    href={tab.route}
                    className="box"
                    style={{ backgroundColor: `${tab.color}` }}
                    key={index}
                  >
                    <div className="maintab-container">
                      <FontAwesomeIcon
                        className="maintab-icon"
                        style={{ color: `${tab.color2}` }}
                        icon={tab.icon}
                      />
                      <div
                        className="maintab-label"
                        style={{ color: `${tab.color3}` }}
                      >
                        {tab.label}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "0px" }} className="main-container">
          <School />
        </div>
        <div className="line"></div>
        <div className="main-container">
          <p className="home-title">급식 및 시간표</p>
          <div className="main-container-display">
            <div className="main-container-50">
              <div className="etc-container ">
                <Link
                  href="./schedules"
                  className="main-container-display margin-bottom-15"
                >
                  <p>
                    오늘의 시간표
                    <br />
                    🕒📖
                  </p>
                </Link>
                <Hometimetable />
              </div>
            </div>
            <Mealcontainer />
          </div>
        </div>
        <div className="line"></div>
        {/* <div className="main-container">
          <div className="graph-display">
            <div className="graph-title-blue">
              <div>
                <p className="graph-title">시험일까지</p>
                <p className="graph-day">D-3</p>
              </div>
            </div>
            <div className="graph">
              <p className="home-title">성적 평균 그래프</p>
              <Graph />
            </div>
          </div>
        </div> */}
      </div>
      <div className="margin"></div>
      {isShaken && <NATnewCode />}{" "}
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f1f1f1",
          marginTop: "20px",
        }}
      >
        <h3>폰의 흔들림 값:</h3>
        <p>X: {acceleration.x.toFixed(2)}</p>
        <p>Y: {acceleration.y.toFixed(2)}</p>
        <p>Z: {acceleration.z.toFixed(2)}</p>
      </div>
    </>
  );
}
