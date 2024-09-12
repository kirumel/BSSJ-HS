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
  return (
    <div className="right-left-margin">
      <p>{session?.user?.nickname}</p>
      <div>
        <form action="/api/post/posts" method="POST">
          <div>
            <input
              className="title-input"
              name="title"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div>
            <textarea
              className="content-input"
              name="content"
              placeholder="글내용"
              rows={4}
              cols={50}
            ></textarea>
          </div>
          <input
            name="nickname"
            value={session?.user?.nickname}
            style={{ display: "none" }}
          />
          <input
            name="authorId"
            value={session?.user?.id}
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
