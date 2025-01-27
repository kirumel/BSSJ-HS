import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function HelloHome() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="hello">
        <p>오류</p>
      </div>
    );
  }
  return (
    <div className="hello">
      <p>
        안녕하세요 {session.user?.name}님!
        <br />
        무엇을 도와드릴까요?
      </p>
      <Link href="./setting" className="main-container-display">
        <img
          className="morebutton"
          src={session.user?.image}
          alt="Profile Image"
        />
      </Link>
    </div>
  );
}
