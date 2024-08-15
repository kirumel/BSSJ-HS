"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./cafe.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";

interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  image: string;
  video: string;
  createdAt: Date;
  like: number;
  likeAuthorId: string[];
}

export default function Cafe() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likePostClassName, setLikePostClassName] = useState<boolean>(false);
  const { data: session } = useSession();
  const [a, seta] = useState<number>(0);
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/post/posts")
      .then((response) => response.json())
      .then((data: Post[]) => {
        setPosts(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="video-container">
        <video className="로딩" src="/로딩.mp4" autoPlay muted loop></video>
      </div>
    );
  }

  return (
    <>
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

            //좋아요 수정
            async function Likepost() {
              const userId = session?.user?.id; // 현재 사용자의 ID를 가져옵니다.
              if (post.likeAuthorId.includes(userId)) {
                setLikePostClassName(false);
                const point = post.like;
                const afterPoint = point - 1;
                const afterLikeAuthorId = post.likeAuthorId.filter(
                  (id) => id !== userId
                );
                if (afterLikeAuthorId.length == 0) {
                  await fetch("/api/post/posts", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: post.id,
                      like: afterPoint,
                      likeAuthorId: "null",
                    }),
                  });
                } else {
                  // 좋아요 수 감소 및 사용자 ID 제거
                  await fetch("/api/post/posts", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: post.id,
                      like: afterPoint,
                      likeAuthorId: afterLikeAuthorId,
                    }),
                  });
                }
              } else {
                const point = post.like;
                const afterPoint = point + 1;
                setLikePostClassName(true);
                console.log(likePostClassName);
                await fetch("/api/post/posts", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: post.id,
                    like: afterPoint,
                    likeAuthorId: userId.toString(),
                  }),
                });
              }
            }

            //게시글 부분
            if (post.image == null && post.video == null) {
              return (
                <>
                  <div className="display-flex">
                    <div className="border-box">
                      <div className="cafe-text-post margin-topbottom10px">
                        <p className="cafe-nickname">{post.nickname}</p>
                        <p className="cafe-post-title">{post.title}</p>
                        <p className="cafe-text-post-content">{post.content}</p>
                        <p>좋아요 : {post.like}</p>
                        <div className="display-between">
                          <p className="cafe-post-date">{formattedDate}</p>
                          <div className="margin-topbottom10px">
                            {post.likeAuthorId.includes(session?.user?.id) ||
                            likePostClassName == true ? (
                              <button
                                onClick={() => Likepost()}
                                style={{
                                  border: "none",
                                  background: "none",
                                  margin: 0,
                                }}
                              >
                                <svg
                                  className="width50"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    marginRight: "10px",
                                  }}
                                >
                                  <path
                                    style={{
                                      fill: "red",
                                      height: "25px",
                                      width: "25px",
                                      marginRight: "10px",
                                    }}
                                    d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => Likepost()}
                                style={{
                                  border: "none",
                                  background: "none",
                                  margin: 0,
                                }}
                              >
                                <svg
                                  style={{
                                    height: "25px",
                                    width: "25px",
                                    marginRight: "10px",
                                  }}
                                  className="width50"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                >
                                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                </svg>
                              </button>
                            )}

                            <Link href={`../posts/${post.id}`}>
                              <svg
                                style={{
                                  height: "25px",
                                  width: "25px",
                                  marginRight: "10px",
                                }}
                                className="width50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                              >
                                <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }

            return (
              <div
                className=" display-flex"
                href={`../posts/${post.id}`}
                key={post.id}
              >
                <div className="cafe-post margin-topbottom10px">
                  <p className="cafe-nickname">{post.nickname}</p>
                  <div className="display-flex">
                    <img className="cafe-insta-img" src={post.image}></img>
                  </div>
                  <div className="margin-topbottom10px">
                    {post.likeAuthorId.includes(session?.user?.id) ? (
                      <button
                        onClick={() => Likepost()}
                        style={{
                          border: "none",
                          background: "none",
                          margin: 0,
                        }}
                      >
                        <svg
                          style={{
                            height: "25px",
                            width: "25px",
                            marginRight: "10px",
                          }}
                          className="width50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => Likepost()}
                        style={{
                          border: "none",
                          background: "none",
                          margin: 0,
                        }}
                      >
                        <svg
                          className="width50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          style={{
                            height: "25px",
                            width: "25px",
                            marginRight: "10px",
                          }}
                        >
                          <path
                            style={{
                              fill: "red",
                              height: "25px",
                              width: "25px",
                              marginRight: "10px",
                            }}
                            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                          />
                        </svg>
                      </button>
                    )}
                    <Link href={`../posts/${post.id}`}>
                      <svg
                        style={{
                          height: "25px",
                          width: "25px",
                          marginRight: "10px",
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
                      </svg>
                    </Link>
                  </div>
                  <p className="cafe-post-title">{post.title}</p>
                  <p className="cafe-post-content">{post.content}</p>
                  <p className="cafe-post-date">{formattedDate}</p>
                  <div style={{ marginTop: "20px" }} className="line"></div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
