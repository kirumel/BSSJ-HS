"use client";
import { useState } from "react";

interface value {
  nickname: string;
  id: string;
}
export default function StartRegister({
  next,
}: {
  next: (nicknameandid: value) => void;
}) {
  const [nicknameandid, setnicknameandid] = useState<value>({
    nickname: "",
    id: "",
  });

  const length =
    nicknameandid.nickname.length < 2 || nicknameandid.id.length < 2;
  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            사용자님의 닉네임과 id을 <br />
            알려주세요!
          </h2>
          <p className="subtitle">아래의 내용을 작성해주세요</p>
          <input
            placeholder="닉네임"
            className="start-register-input"
            type="text"
            name="name"
            onChange={(e) =>
              setnicknameandid((prevState) => ({
                ...prevState,
                nickname: e.target.value,
                id: "",
              }))
            }
          ></input>
          <input
            style={{ marginTop: "15px" }}
            placeholder="id"
            className="start-register-input"
            type="text"
            name="name"
            onChange={(e) =>
              setnicknameandid((prevState) => ({
                ...prevState,
                id: e.target.value,
              }))
            }
          ></input>
        </div>
        <div className="ok-button-div">
          <button
            className="ok-button"
            type="button"
            disabled={length}
            onClick={() => next(nicknameandid)}
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
