"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import "../nosign/style.css";
import logo from "../../../public/logo.png";
import Image from "next/image";

export default function SignIn({ data }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn("credentials", { redirect: false, email, password });
  };

  // Handler for social login
  const handleSocialLogin = (provider: string) => {
    signIn(provider, { redirect: true }); // Use the provider name for social login
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
              <button className="nsign-login-button">Login</button>
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

          <button
            className="google"
            onClick={() => handleSocialLogin("google")}
          >
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
    </>
  );
}
