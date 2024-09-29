"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import "../cafe/cafe.css";

interface Post {
  author: any;
  id: string;
  title: string;
  content: string;
  nickname: string;
  image: string;
  video: string;
  createdAt: Date;
  likes: Like[];
  comments: Comment[]; // Add this line to include comments
}

interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}
interface Comment {
  id: string;
  postId: number;
  nickname: string;
  content: string;
  createdAt: Date;
}

interface CafeProps {
  session: any; // Adjust the type as needed
}

export default function Cafe({ session }: CafeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      axios.get("/api/post/feed").then((response) => {
        setPosts(response.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="video-container">
        <video className="로딩" src="/로딩.mp4" autoPlay muted loop></video>
      </div>
    );
  }
  return (
    <div
      style={{ marginLeft: "0.5rem", marginRight: "0.5rem", marginTop: "1rem" }}
    >
      <div className="feed">
        <h2 style={{ margin: "0" }}>SJHS Feed</h2>
        <p className="subtitle" style={{ fontSize: "12px" }}>
          학교의 알림을 모아볼 수 있어요!
        </p>
      </div>
      {posts.length > 0 && (
        <>
          {posts.map((post: Post) => {
            const postDate = new Date(post.createdAt);
            const today = new Date();
            const isToday = postDate.toDateString() === today.toDateString();
            const isSameYear = postDate.getFullYear() === today.getFullYear();

            //날자 보기좋게
            let formattedDate;
            if (isToday) {
              formattedDate = `오늘 ${postDate.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`;
            } else if (isSameYear) {
              formattedDate = postDate.toLocaleDateString("ko-KR", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              formattedDate = postDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });
            }
            if (post.image == null && post.video == null) {
              return (
                <div className="cafe-body" key={post.id}>
                  <div className="display-flex">
                    <div className="feed-text-post margin-topbottom10px">
                      <div className="display-center">
                        <img
                          src="https://i.imgur.com/tgVDqj1.jpeg"
                          style={{
                            width: "7%",
                            maxWidth: "30px",
                            minWidth: "20px",
                            height: "auto",
                            borderRadius: "0.3rem",
                          }}
                        ></img>
                        <div>
                          <p className="cafe-nickname">성지고 알리미</p>
                          <p className="cafe-nickname-sub">공지사항</p>
                        </div>
                      </div>
                      <p className="cafe-post-title">{post.title}</p>
                      <p className="feed-post-content">{post.content}</p>
                      <div className="display-between">
                        <p className="feed-post-date">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="cafe-body" key={post.id}>
                <div className="display-flex">
                  <div className="feed-text-post margin-topbottom10px">
                    <div className="display-center">
                      <img
                        src="https://i.imgur.com/tgVDqj1.jpeg"
                        style={{
                          width: "7%",
                          maxWidth: "30px",
                          minWidth: "20px",
                          height: "auto",
                          borderRadius: "0.3rem",
                        }}
                      ></img>
                      <div>
                        <p className="cafe-nickname">성지고 알리미</p>
                        <p className="cafe-nickname-sub">공지사항</p>
                      </div>
                    </div>
                    <div className="display-flex">
                      <img className="feed-insta-img" src={post.image}></img>
                    </div>

                    <p className="cafe-post-title">{post.title}</p>
                    <p className="feed-post-content">{post.content}</p>
                    <div className="display-between">
                      <p className="feed-post-date">{formattedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
