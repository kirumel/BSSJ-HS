"use client";
import { useState } from "react";

interface value {
  grade: string;
  class: string;
}
export default function StartRegister({
  next,
}: {
  next: (values: value) => void;
}) {
  const [values, setvalues] = useState<value>({
    grade: "",
    class: "",
  });

  const length = values.grade.length == 1 || values.class.length == 1;
  return (
    <>
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            사용자님의 학년과 반을 <br />
            알려주세요!
          </h2>
          <p className="subtitle">아래의 이메일을 작성해주세요</p>
          <input
            placeholder="학년"
            className="start-register-input"
            type="text"
            name="name"
            onChange={(e) =>
              setvalues((prevState) => ({
                ...prevState,
                grade: e.target.value,
                class: "",
              }))
            }
          ></input>
          <input
            style={{ marginTop: "15px" }}
            placeholder="반"
            className="start-register-input"
            type="text"
            name="name"
            onChange={(e) =>
              setvalues((prevState) => ({
                ...prevState,
                class: e.target.value,
              }))
            }
          ></input>
        </div>
        <div className="ok-button-div">
          <button
            className="ok-button"
            type="button"
            disabled={!length}
            onClick={() => next(values)}
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
