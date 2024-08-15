"use client";

import Link from "next/link";
import logo from "../../public/logo.png";
import Image from "next/image";

export default function Nav() {
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
