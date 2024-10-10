"use client";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Sidenav from "./sidenav";
import Nav from "./nav";
import Navout from "./navout";
import Nosign from "./nosign/page";
import { toast } from "react-toastify";

const ProtectedPage = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  if (session?.user == null && status === "authenticated") {
    signOut();
    alert("오류가 발생하였거나 부적절한 사용으로 차단되었습니다");
  }

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (
    !session &&
    pathname !== "/funnel-register" &&
    pathname !== "/signin" &&
    pathname !== "/accountregister" &&
    pathname !== "/verify-email" &&
    pathname !== "/accountdelete"
  ) {
    return <Nosign />;
  }

  return (
    <div className="sidenavout-display">
      <div className="sidenav">
        <Sidenav />
      </div>
      <div className="main-content">
        <Nav />
        <div>
          {children}
          <Navout />
        </div>
      </div>
    </div>
  );
};

export default ProtectedPage;
