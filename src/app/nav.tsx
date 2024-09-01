"use client";

import Link from "next/link";
import logo from "../../public/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const notshow = [
    "/funnel-register",
    "/devcomment",
    "/success",
    "/nosign",
    "/signin",
    "/cafe",
    "/accountregister",
  ];
  if (pathname && notshow.includes(pathname)) {
    null;
  } else {
    return (
      <>
        <div className="nav">
          <Link href="/">
            <Image src={logo} alt="logo" width={71} height={25} />
          </Link>
        </div>
      </>
    );
  }
}
