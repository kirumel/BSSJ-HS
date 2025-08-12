import { useState } from "react";

export default function StartRegister({
  next,
}: {
  next: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isButtonDisabled =
    password !== confirmPassword ||
    password === "" ||
    confirmPassword === "" ||
    password.length < 8;
  confirmPassword.length < 8;

  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            비밀번호를 <br />
            작성해주세요!
          </h2>
          <p className="subtitle">아래의 비밀번호를 작성해주세요</p>
          <input
            placeholder="비밀번호"
            className="start-register-input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            name="name"
          ></input>
          <input
            style={{ marginTop: "15px" }}
            placeholder="비밀번호 확인"
            className="start-register-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="name"
          ></input>
          <p className="subtitle" style={{ marginTop: "15px" }}>
            비밀번호 조건: 8자리 이상
          </p>
        </div>

        <div className="ok-button-div">
          <button
            disabled={isButtonDisabled}
            className="ok-button"
            type="button"
            onClick={() => next(password)}
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
