"use client";
import Main from "./main";
import ChangeOutTimeT from "./changeOutTimeT/page";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";
export default function Page() {
  const [page, setpage] = useState<string>("main");

  const router = useRouter();
  return (
    <>
      <div>
        <div className="nav">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <button
                className="nightAT-top-button "
                onClick={() => setpage("main")}
              >
                야자 1차 출석
              </button>
              <button
                className="nightAT-top-button"
                onClick={() => setpage("changeOutTimeT")}
              >
                기본 시간 등록하기
              </button>
            </div>
          </div>
          <button className="back-A" onClick={() => router.back()}>
            ←
          </button>
        </div>
      </div>
      <div>
        {page === "main" ? (
          <Main />
        ) : page === "changeOutTimeT" ? (
          <ChangeOutTimeT />
        ) : null}
      </div>
    </>
  );
}
