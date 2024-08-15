export default async function Write() {
  return (
    <div className="dish-display">
      <div>
        <form action="/api/post/regist" method="POST">
          <input style={{ display: "block" }} name="email" placeholder="이메일" />
          <input style={{ display: "block" }} name="password" placeholder="비밀번호" />
          <input style={{ display: "block" }} name="name" placeholder="이름" />
          <input style={{ display: "block" }} name="nickname" placeholder="닉네임" />
          <button style={{ display: "block" }}type="submit">가입하기</button>
        </form>
      </div>
    </div>
  );
}
