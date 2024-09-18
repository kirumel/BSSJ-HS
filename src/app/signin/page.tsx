"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import "../nosign/style.css";
import logo from "../../../public/logo.png";
import Image from "next/image";

interface SignInProps {
  result: (message: string) => void;
  data: (show: boolean) => void;
}

export default function SignIn({ data, result }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const signInResult = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.ok) {
      // 로그인 성공 시, 페이지를 새로고침
      window.location.reload();
    } else {
      result(`${signInResult?.error}`); // 부모 컴포넌트로 결과 메시지 전달
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { redirect: true });
  };

  return (
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
        <form onSubmit={handleSubmit}>
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
            <button className="nsign-login-button">로그인</button>
          </div>
        </form>
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

        <button className="google" onClick={() => handleSocialLogin("google")}>
          Google
        </button>
        <button className="naver" onClick={() => handleSocialLogin("naver")}>
          NAVER
        </button>
        <button className="kakao" onClick={() => handleSocialLogin("kakao")}>
          kakao
        </button>
      </div>
    </div>
  );
}
