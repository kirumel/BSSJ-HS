import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import "./write.css";

export default async function Write() {
  const session = await getServerSession({
    ...authOptions,
    session: {
      ...authOptions.session,
      strategy: "jwt",
    },
  });
  console.log(session.user?.nickname);
  return (
    <div className="p-20">
      <h3>글 작성하기</h3>
      <p>작성자 : {session?.user?.nickname}</p>
      <div>
        <form action="/api/post/posts" method="POST">
          <div>
            <input name="title" placeholder="제목을 입력해주세요" />
          </div>
          <div>
            <textarea
              name="content"
              placeholder="글내용"
              rows={4}
              cols={50}
            ></textarea>
          </div>
          <input
            name="author"
            value={session?.user?.name}
            style={{ display: "none" }}
          />
          <input
            name="nickname"
            value={session?.user?.nickname}
            style={{ display: "none" }}
          />
          <div className="ok-button-div">
            <button className="ok-button" type="submit">
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
