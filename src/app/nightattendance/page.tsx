"use client";
import Main from "./main";
import ChangeOutTimeT from "./changeOutTimeT/page";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
export default function Page() {
  const [page, setpage] = useState<string>("main");
  return (
    <>
      <div>
        <div className="nav">
          <Link href="/">
            <Image src={logo} alt="logo" width={71} height={25} />
          </Link>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <button onClick={() => setpage("main")}>main</button>
              <button onClick={() => setpage("changeOutTimeT")}>
                changeOutTimeT
              </button>
            </div>
          </div>
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
