"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidenav from "./sidenav";
import Nav from "./nav";
import Navout from "./navout";
import Nosign from "./nosign/page";

const ProtectedPage = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

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
    pathname !== "/accountregister"
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
