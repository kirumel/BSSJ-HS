"use client";

import useFunnel from "next-use-funnel";
import StartRegister from "./시작";
import Email from "./이메일";
import Pw from "./비번";
import Name from "./이름";
import Config from "./확인";
import "./style.css";
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
    ["start", "이메일", "비번", "이름", "학년반", "닉네임", "확인"] as const,
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
      <div className="right-left-margin">
        <Funnel>
          <Funnel.Step name="start">
            <StartRegister next={() => setState({ step: "이메일" })} />
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
                  step: "확인",
                  name,
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
