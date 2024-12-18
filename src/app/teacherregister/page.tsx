"use client";
import { useRouter } from "next/navigation";
import "../accountregister/page.css";
export default function Write() {
  const router = useRouter();
  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리의 이전 페이지로 이동
  };
  return (
    <div className="dish-display">
      <button className="back-button" onClick={handleBackClick}>
        <span>&larr;</span>
      </button>
      <div>
        <h3 style={{ margin: "0" }}>교사 회원가입</h3>
        <p className="subtitle" style={{ marginTop: "10", fontSize: "12px" }}>
          임시적으로 이메일 인증이 비활성화 되어있으며
          <br />
          교사 인증코드는 초대코드로 대체될 예정입니다
        </p>
        <form action="/api/post/regist" method="POST">
          <input
            style={{
              marginTop: "20px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="email"
            placeholder="이메일"
            className="text-input"
          />
          <input
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="password"
            placeholder="비밀번호"
            className="text-input"
          />
          <input
            className="text-input"
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="name"
            placeholder="이름"
          />
          <input
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="nickname"
            placeholder="닉네임"
            className="text-input"
          />
          <input
            className="text-input"
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="grade"
            placeholder="학년"
          />
          <input
            className="text-input"
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="class"
            placeholder="반"
          />
          <input
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="grade"
            placeholder="교사 인증코드"
            className="text-input"
          />
          <button
            className="ok-button"
            style={{ display: "block", marginTop: "30px", borderRadius: "5px" }}
            type="submit"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
