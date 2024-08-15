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

export type FunnelState = {
  name: string;
  email: string;
  password: string;
  nickname: string;
  id: string;
  class: string;
  grade: string;
};

export default function ExampleFunnel() {
  const [Funnel, state, setState] = useFunnel(
    [
      "start",
      "약관",
      "이메일",
      "비번",
      "이름",
      "학년반",
      "닉네임",
      "사진",
      "확인",
    ] as const,
    { initialStep: "start" }
  ).withState<FunnelState>({});
  console.log(state);
  return (
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
            setState((prevState) => ({ ...prevState, step: "이름", password }))
          }
        />
      </Funnel.Step>
      <Funnel.Step name="이름">
        <Name
          next={(name) =>
            setState((prevState) => ({ ...prevState, step: "학년반", name }))
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
              id: nicknameandid.id,
            }))
          }
        />
      </Funnel.Step>
      <Funnel.Step name="확인">
        <Config {...state} />
      </Funnel.Step>
    </Funnel>
  );
}
