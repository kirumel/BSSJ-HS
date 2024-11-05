"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SessionDelete() {
  const [session, setSession] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);

  async function handleDelete() {
    if (!session) {
      alert("Please enter a session ID.");
      return;
    }

    try {
      await axios
        .delete(`/api/post/deletesession`, {
          params: {
            id: session,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert("세션 삭제가 완료되었습니다");
            window.location.reload();
          }
        });
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`/api/post/deletesession`);

        // 중복 사용자 ID 제거
        const uniqueUsers = Array.from(
          new Set(response.data.map((user) => user.userId))
        ).map((userId) => {
          return response.data.find((user) => user.userId === userId);
        });

        setUsers(uniqueUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);
  console.log(users);
  return (
    <div className="sessiondelete">
      <h1>세션 삭제</h1>
      <input
        value={session}
        onChange={(e) => setSession(e.target.value)}
        placeholder="유저 id를 입력해주세요"
      />
      <button onClick={handleDelete}>삭제하기</button>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <p>이름</p>
          <p>닉네임</p>
          <p>식별 아이디</p>
        </div>
        <div className="line"></div>
        {users.map((user, index) => (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px",
              }}
            >
              <p>{user.user.name}</p>
              <p>{user.user.nickname}</p>
              <p key={index}>{user.userId}</p>
            </div>
            <div className="line"></div>
          </>
        ))}
      </div>
    </div>
  );
}
