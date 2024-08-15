import { useState, useEffect, useRef } from "react";

export default function StartRegister({
  next,
}: {
  next: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const isButtonDisabled =
    name.length < 3 ||
    name.length > 4 ||
    !/^[가-힣]+$/.test(name) ||
    name === "";
  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            사용자님의 이름을 <br />
            알려주세요!
          </h2>
          <p className="subtitle">아래의 이름을 정확히 작성해주세요</p>
          <input
            placeholder="이름"
            className="start-register-input"
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="ok-button-div">
          <button
            className="ok-button"
            disabled={isButtonDisabled}
            type="button"
            onClick={() => next(name)}
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
