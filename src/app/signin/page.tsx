"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import "../nosign/style.css";
import logo from "../../../public/logo.png";
import Image from "next/image";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function SignIn({
  data,
  result,
  loadingstate,
}: {
  result: (message: string) => void;
  loadingstate: (loading: boolean) => void;
  data: any;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    loadingstate(true);
    setLoading(true); // 요청 시작 시 로딩 상태로 전환
    const signInResult = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    loadingstate(false);
    setLoading(false); // 요청 완료 시 로딩 해제
    if (signInResult?.ok) {
      window.location.reload();
    } else {
      result(`${signInResult?.error}`); // 부모 컴포넌트로 결과 메시지 전달
    }
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = (provider: string) => {
    signIn(provider, { redirect: true }); // 소셜 로그인에 제공자 이름 사용
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <Image
            src={logo}
            alt="logo"
            width={101}
            height={36}
            style={{ marginBottom: "30px" }}
          />
          <span className="close" onClick={() => data(false)}>
            &times;
          </span>
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                type="email"
                placeholder="이메일 email"
                className="nsign-login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호 password"
                className="nsign-login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button" // form submit이 아닌 button click으로 처리
                className="nsign-login-button"
                onClick={handleSignIn}
                disabled={loading} // 로딩 중일 때 버튼 비활성화
              >
                로그인
              </button>
            </div>

            <p
              className="subtitle"
              style={{
                fontSize: "10px",
                margin: "0",
                marginTop: "30px",
                marginBottom: "10px",
              }}
            >
              소셜로그인
            </p>

            <button
              className="google"
              onClick={() => handleSocialLogin("google")}
            >
              Google
            </button>
            <button
              className="naver"
              onClick={() => handleSocialLogin("naver")}
            >
              NAVER
            </button>
            <button
              className="kakao"
              onClick={() => handleSocialLogin("kakao")}
            >
              kakao
            </button>
          </>
        </div>
      </div>
    </>
  );
}
