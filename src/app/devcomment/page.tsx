import Link from "next/link";

export default function dev() {
  return (
    <>
      <div className="home-layout">
        <div className="devcomment-white">
          <div className="comment-imgbox">
            <div className="comment-img"></div>
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
            <h3 className="title">문의</h3>
            <p>
              혹시 건의사항이나 궁금한 점, 오류가 있으면 <br /> 인스타그램
              @th.yestar로 알려주시거나 고객센터에 찾아보세요!
              <br />
              <br />
              <br />
            </p>
            Copyright © 2024 Altisto All rights reserved.
            <br />
            <br />
            <h5>developer / UI/UX design : 2309서현웅</h5>
            <h5>
              special thanks :
              <Link
                href="https://damie.works/profile"
                style={{ textDecoration: "none" }}
              >
                @ekal_.index / 다미
              </Link>
            </h5>
          </div>
          <div style={{ textAlign: "right" }}>
            <button className="subject-button">고객센터</button>
          </div>
        </div>
      </div>
    </>
  );
}
