"use client";

import useFunnel from "next-use-funnel";
import Register2 from "./약관";
import StartRegister from "./시작";
import Email from "./이메일";
import Pw from "./비번";
import Nickname from "./닉네임";
import Img from "./사진";
import Name from "./이름";
import Config from "./확인";
import "./style.css";
import { useState } from "react";
import GradeAndClass from "./학년반";
import logo from "../../../public/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type FunnelState = {
  name: string;
  email: string;
  password: string;
  nickname: string;
  id: string;
  clss: string;
  grade: string;
  step: string;
};

export default function ExampleFunnel() {
  const router = useRouter();
  const [Funnel, state, setState] = useFunnel(
    [
      "start",
      "약관",
      "이메일",
      "비번",
      "이름",
      "학년반",
      "닉네임",
      "확인",
    ] as const,
    { initialStep: "start" }
  ).withState<FunnelState>({
    name: "",
    email: "",
    password: "",
    nickname: "",
    id: "",
    clss: "",
    grade: "",
    step: "start", // 초기 스텝을 추가하세요
  });
  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리의 이전 페이지로 이동
  };
  return (
    <>
      <div className="nav">
        <Image src={logo} alt="logo" width={71} height={25} />
        <button
          style={{ display: state.step == "확인" ? "none" : "block" }}
          onClick={handleBackClick}
        >
          <span>&larr;</span>
        </button>
      </div>
      <div className="right-left-margin">
        <Funnel>
          <Funnel.Step name="start">
            <StartRegister next={() => setState({ step: "약관" })} />
          </Funnel.Step>
          <Funnel.Step name="약관">
            <Register2 next={() => setState({ step: "이메일" })} />
          </Funnel.Step>
          <Funnel.Step name="이메일">
            <Email
              next={(email) => {
                return setState((prevState) => ({
                  ...prevState,
                  step: "비번",
                  email,
                }));
              }}
            />
          </Funnel.Step>
          <Funnel.Step name="비번">
            <Pw
              next={(password) =>
                setState((prevState) => ({
                  ...prevState,
                  step: "이름",
                  password,
                }))
              }
            />
          </Funnel.Step>
          <Funnel.Step name="이름">
            <Name
              next={(name) =>
                setState((prevState) => ({
                  ...prevState,
                  step: "학년반",
                  name,
                }))
              }
            />
          </Funnel.Step>
          <Funnel.Step name="학년반">
            <GradeAndClass
              next={(values) =>
                setState((prevState) => ({
                  ...prevState,
                  step: "닉네임",
                  grade: values.grade,
                  clss: values.class,
                }))
              }
            />
          </Funnel.Step>
          <Funnel.Step name="닉네임">
            <Nickname
              next={(nicknameandid) =>
                setState((prevState) => ({
                  ...prevState,
                  step: "확인",
                  nickname: nicknameandid.nickname,
                }))
              }
            />
          </Funnel.Step>
          <Funnel.Step name="확인">
            <Config {...state} />
          </Funnel.Step>
        </Funnel>
      </div>
    </>
  );
}
