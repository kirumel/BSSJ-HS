import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring"; // react-spring import

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

export default function Page(props: { postdata: (value: Post[]) => void }) {
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

  // 애니메이션을 적용할 spring 훅
  const modalAnimation = useSpring({
    transform: isModalOpen ? "translateY(0)" : "translateY(100%)", // 모달이 열리면 위로 슬라이드, 닫히면 아래로 슬라이드
    opacity: isModalOpen ? 1 : 0, // 모달이 열리면 보이고, 닫히면 사라짐
    config: { tension: 300, friction: 30 }, // 애니메이션 속도 조정
  });

  const handleTypeClick = (type: string) => {
    setSelectedType((prevType) => (prevType === type ? "" : type));
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject((prevSubject) =>
      prevSubject === subject ? "" : subject
    );
  };

  const handleGradeClick = (grade: any) => {
    setSelectedGrade((prevGrade) => (prevGrade === grade ? "" : grade));
  };

  const handleSubTagChange = (subject: string, value: string) => {
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
      props.postdata(response.data);
    } catch (error) {
      console.error("Search request failed:", error);
    }
  };

  // 터치 시작 시 위치 저장
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartTouch(e.touches[0].clientY);
  };

  // 터치 끝나면 모달 내려가는지 체크
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endTouch = e.changedTouches[0].clientY;
    if (startTouch - endTouch > 100) {
      setIsModalOpen(false); // 100px 이상 위로 드래그하면 모달 닫기
    }
  };

  return (
    <div>
      <div className="cafe-top" style={{ height: "50px" }}>
        <div
          style={{
            width: "100%",
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
          ></input>
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

            {/* Modal Content */}
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
                          key={subject}
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
                      <div>
                        <button
                          key={grade}
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
    </div>
  );
}
