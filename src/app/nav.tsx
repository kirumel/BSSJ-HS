"use client";

import Link from "next/link";
import Logo from "./logo/page";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const notshow = [
    "/funnel-register",
    "/success",
    "/nosign",
    "/signin",
    "/cafe",
    "/accountregister",
    "/accountdelete",
    "/",
    "/study",
    "/admin",
    "/feed",
    "/nightAT",
    "/nightattendance",
  ];
  if (pathname && notshow.includes(pathname)) {
    null;
  } else {
    return (
      <>
        <div className="nav">
          <Logo />
        </div>
      </>
    );
  }
}
