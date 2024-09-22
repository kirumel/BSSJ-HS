import "./cafe.css";
import Cafe from "./cafe";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div className="cafe-body">
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
        <Cafe session={session} />
      </div>
      <div className="margin"></div>
    </div>
  );
}
