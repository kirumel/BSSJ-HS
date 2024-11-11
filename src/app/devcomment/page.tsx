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
            <p>
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
            </p>
            Copyright © 2024 Altisto All rights reserved.
            <br />
            <p>개발진</p>
            <h5>developer / UI/UX design : 2309서현웅</h5>
            <h5>
              도움을 주신분들
              <br />
              <br />
              <p>@ekal_.index / 다미</p>
              <br />
              <p>교무기획부 장은경 선생님</p>
              <p>제 18대 교장 정우승 교장선생님</p>
              <p>제 18대 교감 선생님</p>
              <p>유동호 선생님</p>
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}
