"use client";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function hellohome() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="hello">
          <p>
            안녕하세요 {session.user?.name}님!
            <br />
            무엇을 도와드릴까요?
          </p>
          <Link href="./setting" className="main-container-display">
            <img className="morebutton" src={session.user?.image}></img>
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Link href="/api/auth/signin" className="text-decoration-none">
          <div className="hello">
            <p>로그인이 필요합니다.</p>
            <button className="icon-gt white">&gt;</button>
          </div>
        </Link>
      </>
    );
  }
}
