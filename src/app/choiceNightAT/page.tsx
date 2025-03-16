import Link from "next/link";

export default function ChoiceAT() {
  return (
    <>
      <div className="dish-display">
        <div className="main-container">
          <h3>유형을 선택해주세요</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/nightAT2">qr인증</Link>
              </div>
            </div>
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <div className="etc-container display-flex">
                <Link href="/nightAT">교사용</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
