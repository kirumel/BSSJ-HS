"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "../cafe/cafe.css";
import "./style.css";
import Loading from "../loading/page";
import Feednav from "./feednav";

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
  comments: Comment[];
  type2: string[];
  gradeTags: string[];
  subjectTags: string[];
  subSubjectTags: string | null;
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

export default function Cafe() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedPost, setExpandedPost] = useState<Set<string>>(new Set());
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/post/feed")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLike = async (id: any) => {
    const userId = session?.user?.id;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          const hasLiked = post.likes.some(
            (like: Like) => like.userId === userId
          );
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((like: Like) => like.userId !== userId)
              : [
                  ...post.likes,
                  {
                    id: "temp-id",
                    postId: post.id,
                    userId,
                    createdAt: new Date(),
                  },
                ],
          };
        }
        return post;
      })
    );

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      await axios.post(`/api/post/likes/${id}`, { userId });
      axios.get(`/api/post/likes/${id}`).then((res) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, likes: res.data } : post
          )
        );
      });
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
    }
  };
  const handleToggleContent = (id: string) => {
    setExpandedPost((prev) => {
      const newExpandedPost = new Set(prev);
      if (newExpandedPost.has(id)) {
        newExpandedPost.delete(id); // 이미 펼쳐져 있으면 접기
      } else {
        newExpandedPost.add(id); // 펼치기
      }
      return newExpandedPost;
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Feednav postdata={setPosts} />
      <div className="line"></div>
      <div
        style={{
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
          marginTop: "1rem",
        }}
      >
        {
          //상단 타이틀
        }
        <div className="feed">
          <h2 style={{ margin: "0" }}>피드</h2>
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
              const isContentOverflow = post.content.split("\n").length > 3;
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
                            <p className="cafe-nickname-sub">
                              /{post.type2.join("")}/{post.subSubjectTags}
                            </p>
                          </div>
                        </div>
                        <p className="cafe-post-title">{post.title}</p>
                        <p
                          className="feed-post-content"
                          style={{
                            display: "webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: expandedPost.has(post.id)
                              ? "unset"
                              : 3, // 3줄로 제한
                          }}
                        >
                          {post.content}
                        </p>

                        {
                          //태그부분
                        }
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <div>
                            {post.subjectTags &&
                              post.subjectTags.map((subject) => (
                                <p className="tags" key={subject}>
                                  {subject}
                                </p>
                              ))}
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {post.gradeTags &&
                              post.gradeTags.map((grade) => (
                                <p className="tags" key={grade}>
                                  {grade}
                                </p>
                              ))}
                          </div>
                        </div>
                        <div
                          className="display-between"
                          style={{
                            display: "flex",
                            alignContent: "center",

                            marginTop: "10px",
                          }}
                        >
                          <p className="feed-post-date">{formattedDate}</p>{" "}
                          {isContentOverflow && !expandedPost.has(post.id) && (
                            <div
                              className="more"
                              onClick={() => handleToggleContent(post.id)}
                            >
                              <button>더보기 ▼</button>
                            </div>
                          )}
                          {expandedPost.has(post.id) && (
                            <div
                              className="more"
                              onClick={() => handleToggleContent(post.id)}
                            >
                              <button>접기 ▲</button>
                            </div>
                          )}
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
        <div className="margin"></div>
      </div>
    </div>
  );
}
