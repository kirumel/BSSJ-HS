"use client";

import Link from "next/link";
import tabs from "./tap";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavOut() {
  const pathname = usePathname();
  const notshow = [
    "/funnel-register",
    "/devcomment",
    "/success",
    "/nosign",
    "/signin",
    "/accountregister",
    "/posts",
  ];
  if (
    (pathname && notshow.includes(pathname)) ||
    pathname.startsWith("/posts")
  ) {
    return null;
  }
  return (
    <div className="navout">
      <div className="navout-list">
        {tabs.map((tab, index) => (
          <Link href={tab.route} key={index}>
            <div
              className={`link ${
                pathname === tab.route ? "active" : "non-active"
              }`}
            >
              <FontAwesomeIcon className="tab-icon" icon={tab.icon} />
              <p className="tab-label">{tab.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
