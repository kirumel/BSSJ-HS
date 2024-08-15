import Link from "next/link";
import Homeschedule from "./homeschedules";
import Hometimetable from "./hometimetable";
import maintaps from "./maintabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Hello from "./hellohome";
import "./style.css";
import Graph from "./graph";

export default async function home() {
  return (
    <>
      <div className="home-layout">
        <div style={{ marginRight: "1.5rem", marginLeft: "1.5rem" }}>
          <Hello />
        </div>
        <div>
          <div className="main-container">
            <div className="scroll-containercenter">
              <div className="scroll-container">
                <div className="main-event-imgbox">
                  <img className="main-event-img" src="altisto.png"></img>
                  <div
                    className="main-event-overlay2"
                    style={{ backgroundColor: "rgb(132, 146, 209)" }}
                  ></div>
                  <div
                    className="main-event-overlay1"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, transparent 48.15%, rgba(132, 146, 209,1) 94.91%)",
                      color: "white",
                    }}
                  ></div>
                  <p className="main-event-title" style={{ color: "white" }}>
                    SJHS helper
                    <br />
                    beta version 1.0
                  </p>
                </div>
                <div className="main-event-imgbox">
                  <img
                    className="main-event-img"
                    src="instagram-logo2.jpg"
                  ></img>
                  <div
                    className="main-event-overlay2"
                    style={{ backgroundColor: "rgb(280,150,150)" }}
                  ></div>
                  <div
                    className="main-event-overlay1"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, transparent 48.15%, rgba(280,150,150) 94.91%)",
                      color: "white",
                    }}
                  ></div>
                  <p className="main-event-title" style={{ color: "white" }}>
                    sjhs helper 인스타그램 홍보하고
                    <br />
                    치킨 받아가자!
                  </p>
                </div>
                <div className="main-event-imgbox">
                  <img className="main-event-img" src="main.jpg"></img>
                  <div
                    className="main-event-overlay2"
                    style={{ backgroundColor: "rgb(280,160,160)" }}
                  ></div>
                  <div
                    className="main-event-overlay1"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, transparent 48.15%, rgba(280,160,160) 94.91%)",
                      color: "white",
                    }}
                  ></div>
                  <p className="main-event-title" style={{ color: "white" }}>
                    성지고 교복 나눔제
                    <br />
                    관심있다면 클릭!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-container" style={{ paddingTop: "0" }}>
          <div className="scroll-containercenter">
            <div className="scroll-container">
              <div className="scroll-list">
                {maintaps.map((tab, index) => (
                  <a href={tab.route} className="box" key={index}>
                    <div className="maintab-container">
                      <FontAwesomeIcon
                        className="maintab-icon"
                        icon={tab.icon}
                      />
                      <div className="maintab-label">{tab.label}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
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
            <div className="main-container-50">
              <div className="etc-container ">
                <Link
                  href="./meals"
                  className="main-container-display margin-bottom-15"
                >
                  <p>
                    오늘의 식단 <br />
                    🍚🥢
                  </p>
                </Link>
                <Homeschedule />
              </div>
            </div>
          </div>
        </div>
        <div className="line"></div>
        <div className="main-container">
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
        </div>
      </div>
    </>
  );
}
