"use client";
import { useSession } from "next-auth/react";
import Settimetable from "./settimetable";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";

export default function Setting() {
  const { data: originalSession, loading } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [deletionMessage, setDeletionMessage] = useState("");

  let session = originalSession;

  if (session && !session.user?.name) {
    session = { ...session, user: { ...session.user, name: "unknown" } };
  }
  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post("/api/delete-account", {
        email: session.user.email,
        password,
      });
      if (response.status === 200) {
        signOut(); // Log out the user after deletion
      } else {
        setDeletionMessage("오류 비밀번호가 일치하지 않습니다");
      }
    } catch (error) {
      setDeletionMessage("An error occurred during account deletion.");
    }
  };

  if (isLoading) {
    return <video className="로딩" src="/로딩.mp4" autoPlay muted loop />;
  } else {
    if (session) {
      return (
        <>
          <div>
            <div className="home-layout">
              <div className="insert main-container">
                <div className="profile etc-container">
                  <img
                    className="profileimg"
                    src={
                      session.user?.image ||
                      "https://www.studiopeople.kr/common/img/default_profile.png"
                    }
                  ></img>
                  <div>
                    <h2>{session.user?.name}</h2>
                    <p>성지고등학교</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="line"></div>
            <Settimetable name={session.user?.name} />
            <div className="line"></div>
          </div>
          <div className="insert main-container">
            <button className="ok-button" onClick={() => signOut()}>
              로그아웃
            </button>
            <div className="delete-account">
              <h3>계정 삭제</h3>
              <input
                type="password"
                className="text-input"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <button className="ok-button" onClick={handleDeleteAccount}>
                계정 삭제하기
              </button>
              {deletionMessage && <p>{deletionMessage}</p>}
            </div>
          </div>
          <div className="margin"></div>
        </>
      );
    } else {
      return (
        <div className="loading">
          로그인이
          <br />
          필요합니다
        </div>
      );
    }
  }
}
