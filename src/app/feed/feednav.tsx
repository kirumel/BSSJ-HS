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
    try {
      // posts: 백엔드에서 검색 조건을 적용한 API 호출 (여기선 그대로 호출)
      const postResponse = await axios.get("/api/post/feed", {
        params: {
          type2: selectedType,
          subject: selectedSubject,
          subSubject: subTags[selectedSubject] || "",
          grade: selectedGrade,
          query: searchQuery,
        },
      });
      // assignments: 전체 데이터를 받아온 후 클라이언트에서 필터링
      const assignmentResponse = await axios.get("/api/flfhtmznf");
      const posts: Post[] = postResponse.data;
      const assignments: Assignment[] = assignmentResponse.data;

      // assignments 필터링 (검색어가 포함되어 있는지 검사)
      let filteredAssignments = assignments;
      if (searchQuery || selectedType || selectedSubject || selectedGrade) {
        console.log("검색어:", searchQuery.trim());
        console.log(
          "필터 조건:",
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
            .filter((item) => item !== ""); // 제목에서 추출한 태그들

          const teacherField = assignment.teacherName;
          const titleField = assignment.title.split("-")[1] || "";

          // ✅ 검색어가 제목, 태그, 선생님 이름 중 하나라도 포함하는지 확인
          const matchesSearchQuery =
            teacherField.includes(searchQuery) ||
            titleField.includes(searchQuery);

          // ✅ 선택한 필터 (type, subject, grade) 조건 확인
          const matchesFilters =
            (!selectedType || tagsField.includes(selectedType)) &&
            (!selectedSubject || tagsField.includes(selectedSubject)) &&
            (!selectedGrade || tagsField.includes(selectedGrade));
          return matchesSearchQuery && matchesFilters;
        });
      }

      const postItems: FeedItem[] = posts.map((post) => ({
        feedType: "post",
        date: new Date(post.createdAt),
        data: post,
      }));

      const assignmentItems: FeedItem[] = filteredAssignments.map(
        (assignment) => {
          const currentYear = new Date().getFullYear();
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
