"use client";
import "./cafe.css";
import Cafe from "./cafe";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";

export default function Page() {
  const { data: session } = useSession();
  return (
    <>
      <div className="cafe-top">
        <Link href="/">
          <div className="cafe-top-logo">
            <Image src={logo} alt="logo" width={71} height={25} />
            <p className="cafe-top-title">
              Post
              <br />
              Chat
            </p>
          </div>
        </Link>
        <input className="cafe-top-search" placeholder="검색"></input>
        <img className="cafe-profileimg" src={session?.user?.image}></img>
      </div>
      <div className="line"></div>
      <div className="cafe-middle-container">
        <Cafe />
      </div>
    </>
  );
}
