import Link from "next/link";

export default function ChoiceAT() {
  return (
    <>
      <div className="dish-display">
        <div className="main-container">
          <h3 className="home-title padding-right-left">
            오늘은 어떤 역할이신가요?
          </h3>
          <div className="main-container-display">
            <div className="main-container-50">
              <div className="etc-container display-flex">
                <Link href="/choiceATteacher">교사</Link>
              </div>
            </div>
            <div className="main-container-50">
              <div className="etc-container display-flex">
                <Link href="/choiceATsupervisor">야자 감독관</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
