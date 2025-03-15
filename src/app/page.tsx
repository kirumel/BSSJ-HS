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
import NATnewCode from "./NATnewCode/page";

export default function Home() {
  const { data: session } = useSession();

  const [isShaken, setIsShaken] = useState(false);

  useEffect(() => {
    if (isShaken === true) {
      const handleMotion = (event: DeviceMotionEvent) => {
        const { acceleration } = event;

        // 가속도 값이 일정 기준 이상이면 폰이 흔들린 것으로 판단
        if (acceleration.x > 10 || acceleration.y > 10 || acceleration.z > 10) {
          setIsShaken(false);
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
    } else {
      const handleMotion = (event: DeviceMotionEvent) => {
        const { acceleration } = event;

        // 가속도 값이 일정 기준 이상이면 폰이 흔들린 것으로 판단
        if (acceleration.x > 10 || acceleration.y > 10 || acceleration.z > 10) {
          setIsShaken(true);
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
    }
  }, []);

  return (
    <>
      {isShaken && <NATnewCode />}
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
    </>
  );
}
