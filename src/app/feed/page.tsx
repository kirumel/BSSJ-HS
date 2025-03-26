"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "../cafe/cafe.css";
import "./style.css";
import Loading from "../loading/page";
import Feednav from "./Feednav";

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
  startDate: string; // 예: "03-24 11:30:00"
  endDate: string;
  title: string;
  status: string;
  link: string;
}

// FeedItem 타입: 두 종류 데이터를 구분하기 위한 공통 타입
export type FeedItem =
  | { feedType: "assignment"; date: Date; data: Assignment }
  | { feedType: "post"; date: Date; data: Post };

export default function Cafe() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedPost, setExpandedPost] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsLoading(true);
    Promise.all([axios.get("/api/post/feed"), axios.get("/api/flfhtmznf")])
      .then(([postResponse, assignmentResponse]) => {
        const posts: Post[] = postResponse.data;
        const assignments: Assignment[] = assignmentResponse.data;

        // 일반 포스트: createdAt 그대로 사용
        const postItems: FeedItem[] = posts.map((post) => ({
          feedType: "post",
          date: new Date(post.createdAt),
          data: post,
        }));
        let currentYear = "";
        // 리로스쿨(과제): startDate에 현재 연도 붙여서 Date 객체 생성
        const assignmentItems: FeedItem[] = assignments.map((assignment) => {
          currentYear = assignment.title.split("-")[0].slice(0, 4);
          const dateString = assignment.startDate.match(/^\d{4}/)
            ? assignment.startDate
            : `${currentYear}-${assignment.startDate}`;
          return {
            feedType: "assignment",
            date: new Date(dateString),
            data: assignment,
          };
        });

        // 두 배열 합치고 날짜 내림차순 정렬
        const combined = [...postItems, ...assignmentItems].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );
        setFeedItems(combined);
      })
      .catch((error) => {
        console.error("피드 데이터 로드 오류:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleToggleContent = (id: string) => {
    setExpandedPost((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <Feednav
        postdata={(newFeedItems: FeedItem[]) => {
          setFeedItems(newFeedItems);
        }}
      />
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

        {feedItems.map((item, index) => {
          if (item.feedType === "assignment") {
            const assignment = item.data as Assignment;

            return (
              <div className="cafe-body" key={`assignment-${index}`}>
                <div className="display-flex">
                  <div className="feed-text-post margin-topbottom10px">
                    <div
                      className="display-between"
                      style={{
                        display: "flex",
                        alignContent: "center",
                        marginTop: "0px",
                      }}
                    >
                      <div>
                        <div className="display-center">
                          <img
                            src="https://riroschool.kr/assets/imgs/common/logo_cloud.svg"
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
                            <p className="cafe-nickname">
                              리로스쿨 / {assignment.teacherName}
                            </p>
                          </div>
                        </div>
                        <p className="cafe-post-title">
                          {assignment.title.split("-")[1]}
                        </p>
                      </div>
                      <button
                        className="riro-status"
                        style={{
                          backgroundColor:
                            assignment.status === "제출"
                              ? ""
                              : assignment.status === "마감"
                              ? "#FD7373"
                              : "#C6C6C6",
                        }}
                      >
                        {assignment.status}
                      </button>
                    </div>
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
                      <div>
                        <div style={{ display: "flex" }}>
                          {assignment.title
                            .split("-")[0]
                            .toString()
                            .slice(5)
                            .split(" ")
                            .filter((item) => item !== "")
                            .map((tag, idx) => (
                              <div className="tags" key={idx}>
                                {tag}
                              </div>
                            ))}
                        </div>
                      </div>
                      <p className="feed-post-date">
                        {assignment.startDate} 부터
                        <br /> {assignment.endDate} 까지
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // 일반 포스트 렌더링 (기존 코드 유지)
            const post = item.data as Post;
            const postDate = new Date(post.createdAt);
            const today = new Date();
            const isToday = postDate.toDateString() === today.toDateString();
            const isSameYear = postDate.getFullYear() === today.getFullYear();

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
                        <div style={{ display: "flex", alignItems: "center" }}>
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
          }
        })}
        <div className="margin"></div>
      </div>
    </div>
  );
}
