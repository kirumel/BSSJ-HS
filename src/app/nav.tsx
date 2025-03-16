"use client";

import Link from "next/link";
import Logo from "./logo/page";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
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
    "/feed",
    "/nightAT2",
    "/nightattendance",
  ];

  if (pathname && notshow.includes(pathname)) {
    return null;
  } else {
    return (
      <div className="nav">
        <Link href="/">
          <Logo />
        </Link>
        <button className="back-A" onClick={() => router.back()}>
          ←
        </button>
      </div>
    );
  }
}
