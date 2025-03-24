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

interface Assignment {
  teacherName: string;
  startDate: string;
  endDate: string;
  title: string;
  status: string;
  link: string;
}

export default function Cafe() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedPost, setExpandedPost] = useState<Set<string>>(new Set());
  console.log(assignments);

  // 피드 데이터 로드
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/post/feed")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("피드 로드 오류:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 과제(공지) 크롤링 데이터 로드
  useEffect(() => {
    axios
      .get("/api/flfhtmznf")
      .then((response) => {
        // response.data가 Assignment 배열이라고 가정
        setAssignments(response.data);
      })
      .catch((error) => {
        console.error("과제 데이터 로드 오류:", error);
      });
  }, []);

  const handleToggleContent = (id: string) => {
    setExpandedPost((prev) => {
      const newExpandedPost = new Set(prev);
      if (newExpandedPost.has(id)) {
        newExpandedPost.delete(id);
      } else {
        newExpandedPost.add(id);
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
        {/* 피드 상단 타이틀 */}
        <div className="feed">
          <h2 style={{ margin: "0" }}>피드</h2>
          <p className="subtitle" style={{ fontSize: "12px" }}>
            학교의 알림을 모아볼 수 있어요!
          </p>
        </div>
        {assignments.length > 0 && (
          <>
            {assignments.map((assignment, index) => (
              <div className="cafe-body" key={index}>
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
                        alt="프로필"
                      />
                      <div>
                        <p className="cafe-nickname">리로스쿨 알리미</p>
                      </div>
                    </div>
                    <p className="cafe-post-title"> {assignment.title}</p>
                    <p className="feed-post-content">{assignment.status}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    ></div>
                    <div
                      className="display-between"
                      style={{
                        display: "flex",
                        alignContent: "center",
                        marginTop: "0px",
                      }}
                    >
                      <p className="feed-post-date">
                        {assignment.startDate} ~ {assignment.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {posts.length > 0 && (
          <>
            {posts.map((post: Post) => {
              const postDate = new Date(post.createdAt);
              const today = new Date();
              const isToday = postDate.toDateString() === today.toDateString();
              const isSameYear = postDate.getFullYear() === today.getFullYear();

              // 날짜를 보기 좋게 포맷팅
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

              // 이미지나 비디오가 없는 경우
              if (!post.image && !post.video) {
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
                            alt="프로필"
                          />
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
                              : 3,
                          }}
                        >
                          {post.content}
                        </p>
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
                          <p className="feed-post-date">{formattedDate}</p>
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

              // 이미지나 비디오가 있는 경우
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
                          alt="프로필"
                        />
                        <div>
                          <p className="cafe-nickname">성지고 알리미</p>
                          <p className="cafe-nickname-sub">공지사항</p>
                        </div>
                      </div>
                      <div className="display-flex">
                        <img
                          className="feed-insta-img"
                          src={post.image}
                          alt="피드 이미지"
                        />
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
        {/* 과제(공지) 섹션 */}

        <div className="margin"></div>
      </div>
    </div>
  );
}
