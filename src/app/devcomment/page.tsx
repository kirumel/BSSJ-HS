import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/newlogo.png";
import "./style.css";

export default function dev() {
  return (
    <>
      <div className="home-layout">
        <div className="devcomment-white">
          <div>
            <Image
              className="devcomment-logo"
              src={logo}
              alt="logo"
              width={80}
              height={80}
            />
          </div>
          <div className="devcomment-layout">
            <h3 className="title">성지고 학습 도우미</h3>
            <h5>
              성지고 학습 도우미 - B.SJHS helper는
              <br />
              성지고등학교 학생들을 위해 개발된 앱이에요!
              <br />
              <br />
              개발은 next.js , react-native/expo를 이용하여
              <br />
              웹과 앱 모두 쉽게 접속 가능해요
              <br />
              <br />
            </h5>
            <h3
              className="title"
              style={{ marginTop: "20px", marginBottom: "0" }}
            >
              dev 💻
            </h3>
            <div className="line"></div>
            <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
              developer | UI / UX design : 2309서현웅
            </h5>
            <h3
              className="title"
              style={{ marginTop: "30px", marginBottom: "0" }}
            >
              special thanks✨
            </h3>
            <div className="line"></div>
            <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
              ✨ 교무기획부 장은경 선생님
            </h5>
            <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
              🔧 @ekal_.index / 다미
            </h5>
            <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
              🦅 제 18대 교장 정우승 선생님
            </h5>
            <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
              🩺 제 18대 교감 김옥녀 선생님
            </h5>
            <h5
              style={{
                marginTop: "30px",
                marginBottom: "0",
                backgroundColor: "gray",
                color: "white",
                padding: "5px",
                textAlign: "right",
                fontSize: "10px",
              }}
            >
              Copyright © 2024 Altisto All rights reserved.
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}
