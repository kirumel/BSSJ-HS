"use client";
import Main from "./main";
import ChangeOutTimeT from "./changeOutTimeT/page";
import { useState } from "react";
export default function Page() {
  const [page, setpage] = useState<string>("");
  return (
    <>
      <div>
        <button onClick={() => setpage("main")}>main</button>
        <button onClick={() => setpage("changeOutTimeT")}>
          changeOutTimeT
        </button>
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
