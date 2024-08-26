import Link from "next/link";

export default function ChoiceAT() {
  return (
    <>
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
                <a href="/compareAT">
                  감독관 결과 <br />
                  확인하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
