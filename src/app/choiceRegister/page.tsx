import Link from "next/link";

export default function ChoiceAT() {
  return (
    <>
      <div className="dish-display">
        <div className="main-container">
          <h3>계정 유형을 선택해주세요</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/funnel-register">학생 계정</Link>
              </div>
            </div>
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/teacherregister">교사 계정</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
