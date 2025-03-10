import "./cafe.css";
import Cafe from "./cafe";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import Board from "./boards";
export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div className="cafe-body">
      <Board />

      <div className="cafe-middle-container">
        <Cafe session={session} />
      </div>
      <div className="margin"></div>
    </div>
  );
}
