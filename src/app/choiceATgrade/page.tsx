import Link from "next/link";

export default function ChoiceAT() {
  return (
    <>
      <div className="dish-display">
        <div className="main-container">
          <h3>오늘은 어떤 역할이신가요?</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/choiceATsupervisor1">1학년</Link>
              </div>
            </div>
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/choiceATsupervisor2">2학년</Link>
              </div>
            </div>
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/choiceATsupervisor3">3학년</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
