"use client";
import { useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { FeedItem } from "./Cafe"; // FeedItem 타입 가져오기

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

interface FeednavProps {
  postdata: (value: FeedItem[]) => void;
}

export default function Feednav({ postdata }: FeednavProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [subTags, setSubTags] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [startTouch, setStartTouch] = useState(0);

  const subjects = ["국어", "영어", "수학", "사회", "과학", "한국사", "일본어"];
  const grades = ["1학년", "2학년", "3학년"];
  const typeOptions = ["공지사항", "시험범위", "수행평가"];

  const modalAnimation = useSpring({
    transform: isModalOpen ? "translateY(0)" : "translateY(100%)",
    opacity: isModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  });

  const handleTypeClick = (type: string) => {
    setSelectedType((prev) => (prev === type ? "" : type));
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject((prev) => (prev === subject ? "" : subject));
  };

  const handleGradeClick = (grade: string) => {
    setSelectedGrade((prev) => (prev === grade ? "" : grade));
  };

  const handleSubTagChange = (subject: string, value: string) => {
    setSubTags((prev) => ({ ...prev, [subject]: value }));
  };

  const handleSearch = async () => {
    setIsModalOpen(false);
    console.log("handleSearch 함수 실행됨"); // 추가
    try {
      const postResponse = await axios.get("/api/post/feed", {
        params: {
          type2: selectedType,
          subject: selectedSubject,
          subSubject: subTags[selectedSubject] || "",
          grade: selectedGrade,
          query: searchQuery,
        },
      });

      const assignmentResponse = await axios.get("/api/flfhtmznf");
      console.log("API 요청 완료", postResponse, assignmentResponse); // 추가

      const posts: Post[] = postResponse.data;
      const assignments: Assignment[] = assignmentResponse.data;

      let filteredAssignments = assignments;
      if (searchQuery || selectedType || selectedSubject || selectedGrade) {
        console.log("검색어:", searchQuery.trim());
        console.log(
          selectedType,
          selectedSubject,
          selectedGrade,
          subTags[selectedSubject]
        );

        filteredAssignments = assignments.filter((assignment) => {
          const tagsField = assignment.title
            .split("-")[0]
            .slice(5)
            .split(" ")
            .filter((item) => item !== "");

          const teacherField = assignment.teacherName;
          const titleField = assignment.title.split("-")[1] || "";

          const matchesSearchQuery =
            teacherField.includes(searchQuery) ||
            titleField.includes(searchQuery);

          const matchesFilters =
            (!selectedType || tagsField.includes(selectedType)) &&
            (!selectedSubject || tagsField.includes(selectedSubject)) &&
            (!selectedGrade || tagsField.includes(selectedGrade));

          return matchesSearchQuery && matchesFilters;
        });

        console.log("필터링된 assignments:"); // 추가

        const postItems: FeedItem[] = posts.map((post) => ({
          feedType: "post",
          date: new Date(post.createdAt),
          data: post,
        }));

        let currentYear = "";

        const assignmentItems: FeedItem[] = filteredAssignments.map(
          (assignment) => {
            currentYear = assignment.title.split("-")[0].slice(0, 4);
            const dateString = assignment.startDate.match(/^\d{4}/)
              ? assignment.startDate
              : `${currentYear}-${assignment.startDate}`;
            return {
              feedType: "assignment",
              date: new Date(dateString),
              data: assignment,
            };
          }
        );

        const combined = [...postItems, ...assignmentItems].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );

        postdata(combined);
      }
    } catch (error) {
      console.error("Search request failed:", error);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartTouch(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endTouch = e.changedTouches[0].clientY;
    if (startTouch - endTouch > 100) {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="cafe-top" style={{ height: "50px" }}>
        <div
          style={{
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            style={{ width: "80%" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cafe-top-search"
            placeholder="검색어를 입력해주세요"
            type="search"
          />
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

      {isModalOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setIsModalOpen(false)}
          ></div>
          <animated.div
            style={{
              ...modalAnimation,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                margin: "0",
                borderBottomLeftRadius: "0",
                borderBottomRightRadius: "0",
                height: "90vh",
                overflow: "hidden",
                paddingRight: "20px",
                paddingLeft: "20px",
                paddingBottom: "20px",
                paddingTop: "0px",
                boxSizing: "border-box",
              }}
              className="modal-content"
            >
              <div
                onClick={() => setIsModalOpen(false)}
                className="modal-close-button"
                style={{
                  cursor: "pointer",
                  position: "static",
                  display: "flex",
                  justifyContent: "right",
                  marginTop: "3px",
                  marginBottom: "3px",
                }}
              >
                &times;
              </div>
              <div
                style={{
                  overflow: "scroll",
                  height: "calc(100% - 100px)",
                  borderRadius: "0.5rem",
                }}
              >
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
                    <div key={subject}>
                      <button
                        onClick={() => handleSubjectClick(subject)}
                        className="feed-button"
                        style={{
                          backgroundColor:
                            selectedSubject === subject ? "lightblue" : "",
                        }}
                      >
                        {subject}
                      </button>
                    </div>
                  ))}
                </div>
                {selectedSubject && (
                  <div>
                    <div className="line"></div>
                    <p className="adminfeed-title">
                      {selectedSubject} 세부과목
                    </p>
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
                    <div key={grade}>
                      <button
                        onClick={() => handleGradeClick(grade)}
                        className="feed-button"
                        style={{
                          backgroundColor:
                            selectedGrade === grade ? "lightgreen" : "",
                        }}
                      >
                        {grade}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                style={{ marginTop: "0.8rem" }}
                onClick={handleSearch}
                className="ok-button"
              >
                검색
              </button>
            </div>
          </animated.div>
        </>
      )}
    </div>
  );
}
