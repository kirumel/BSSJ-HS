"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import "../cafe/cafe.css";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
  gradetags: string[];
  subjecttags: string[];
  subsubjecttags: string | null;
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

const subjects = ["국어", "영어", "수학", "사회", "과학", "한국사", "일본어"];
const grades = ["1학년", "2학년", "3학년"];
const typeOptions = ["공지사항", "시험범위", "수행평가"];

export default function Cafe() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [subTags, setSubTags] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  console.log(posts);
  const handleTypeClick = (type) => {
    setSelectedType((prevType) => (prevType === type ? "" : type)); // Toggle selection
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject((prevSubject) =>
      prevSubject === subject ? "" : subject
    );
  };

  const handleGradeClick = (grade) => {
    setSelectedGrade((prevGrade) => (prevGrade === grade ? "" : grade)); // Toggle selection
  };

  const handleSubTagChange = (subject, value) => {
    setSubTags((prevTags) => ({
      ...prevTags,
      [subject]: value,
    }));
  };

  const handleSearch = async () => {
    setIsModalOpen(false);
    try {
      const response = await axios.get("/api/post/feed", {
        params: {
          type2: selectedType,
          subject: selectedSubject,
          subSubject: subTags[selectedSubject] || "",
          grade: selectedGrade,
          query: searchQuery,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Search request failed:", error);
    }
  };

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
              ? post.likes.filter((like: Like) => like.userId !== userId) // Remove current userId
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

  if (isLoading) {
    return (
      <div className="video-container">
        <video className="로딩" src="/로딩.mp4" autoPlay muted loop></video>
      </div>
    );
  }

  return (
    <div>
      <div className="cafe-top">
        <Link href="/">
          <div className="cafe-top-logo">
            <Image src={logo} alt="logo" width={71} height={25} />
          </div>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            style={{ width: "30vw" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cafe-top-search"
            placeholder="검색"
          ></input>
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faSearch} size="1x" />
          </button>
        </div>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          onClick={() => setIsModalOpen(true)}
        >
          <div>
            <div className="option"></div>
            <div className="option"></div>
            <div className="option"></div>
          </div>
        </button>
      </div>

      <div className="line"></div>
      <div
        style={{
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
          marginTop: "1rem",
        }}
      >
        {isModalOpen && (
          <div className="modal">
            <div style={{ margin: "10px" }} className="modal-content">
              <span
                onClick={() => setIsModalOpen(false)}
                className="modal-close-button"
              >
                &times;
              </span>
              <input
                className="adminfeed-input"
                type="text"
                placeholder={`${selectedSubject} 내용 검색`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <p className="adminfeed-title">타입 선택</p>
              <div>
                {typeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeClick(type)}
                    className="adminfeed-button"
                    style={{
                      backgroundColor:
                        selectedType === type ? "#BCC5F7" : "#CFD0D1",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="line"></div>

              <p className="adminfeed-title">과목 선택</p>
              <div>
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectClick(subject)}
                    className="adminfeed-button"
                    style={{
                      backgroundColor:
                        selectedSubject === subject ? "lightblue" : "#CFD0D1",
                    }}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {selectedSubject && (
                <div>
                  <div className="line"></div>
                  <p className="adminfeed-title">{selectedSubject} 세부과목</p>
                  <input
                    className="adminfeed-input"
                    type="text"
                    placeholder={`${selectedSubject} 세부 과목`}
                    value={subTags[selectedSubject] || ""}
                    onChange={(e) =>
                      handleSubTagChange(selectedSubject, e.target.value)
                    }
                  />
                </div>
              )}
              <div className="line"></div>
              <p className="adminfeed-title">학년 선택</p>
              <div>
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleGradeClick(grade)}
                    className="adminfeed-button"
                    style={{
                      backgroundColor:
                        selectedGrade === grade ? "lightgreen" : "#CFD0D1",
                    }}
                  >
                    {grade}
                  </button>
                ))}
              </div>

              <button
                style={{ marginTop: "1rem" }}
                onClick={handleSearch}
                className="ok-button"
              >
                검색
              </button>
            </div>
          </div>
        )}
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
                            <p className="cafe-nickname-sub">
                              /{post.type2.join("")}/{post.subSubjectTags}
                            </p>
                          </div>
                        </div>
                        <p className="cafe-post-title">{post.title}</p>
                        <p className="feed-post-content">{post.content}</p>
                        <p className="tagtitle" style={{ marginTop: "10px" }}>
                          tag:
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
        <div className="margin"></div>
      </div>
    </div>
  );
}
