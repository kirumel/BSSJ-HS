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
  }
}
