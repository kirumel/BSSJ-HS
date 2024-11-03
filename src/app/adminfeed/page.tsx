"use client";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./style.css";

interface PostData {
  title: string;
  content: string;
  type: string;
  tags: string[];
  subtags: string[];
  authorId: string;
  nickname: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [subTags, setSubTags] = useState<{ [key: string]: string }>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showSubject, setShowSubject] = useState<boolean>(false);
  const [showGrade, setShowGrade] = useState<boolean>(false);
  const [button, setbutton] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();
  if (session?.user?.role !== "SjAdMin") {
    router.push("/");
    alert("관리자 권한이 없습니다");
  }

  const subjects: string[] = [
    "국어",
    "영어",
    "수학",
    "사회",
    "과학",
    "한국사",
    "일본어",
  ];
  const grades: string[] = ["1학년", "2학년", "3학년"];

  const typeOptions: string[] = ["공지사항", "시험범위", "수행평가"];

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setTags([type]);

    if (type === "공지사항") {
      setShowSubject(false);
      setShowGrade(true);
    } else {
      setShowSubject(true);
      setShowGrade(false);
      setSelectedSubject(null);
    }
  };

  const handleSubjectClick = (subject: string) => {
    if (selectedSubject === subject) {
      setSelectedSubject(null);
    } else {
      setSelectedSubject(subject);
      if (!subTags[subject]) {
        setSubTags({ ...subTags, [subject]: "" });
      }
    }
    setShowGrade(!selectedSubject || selectedSubject === subject);
  };

  const handleGradeClick = (grade: string) => {
    if (tags.includes(grade)) {
      setTags(tags.filter((t) => t !== grade));
    } else {
      setTags([...tags, grade]);
    }
  };

  const handleSubTagChange = (subject: string, value: string) => {
    setSubTags({ ...subTags, [subject]: value });
  };

  const isButtonDisabled = () => {
    const isBasicFieldsFilled = title && content && selectedType;
    if (selectedType === "공지사항") {
      return !(isBasicFieldsFilled && tags.some((tag) => grades.includes(tag)));
    } else {
      return !(
        isBasicFieldsFilled &&
        selectedSubject &&
        subTags[selectedSubject]?.trim() &&
        tags.some((tag) => grades.includes(tag))
      );
    }
  };

  const handleSubmit = () => {
    const postData: PostData = {
      title,
      nickname: session?.user?.nickname || "",
      authorId: session?.user?.id || "",
      content,
      type: "feed",
      tags,
      subtags: Object.values(subTags).filter((subtag) => subtag),
    };
    setbutton(true);
    alert("잠시만 기다려주세요!");
    axios
      .post("/api/post/posts", postData)
      .then((response) => {
        if (response.status === 200) {
          setbutton(false);
          alert("feed 작성 성공!");
          router.push("/feed");
        }
      })
      .catch((error) => {
        alert("이런 오류가 발생했어요!");
        setbutton(false);
        console.error(error);
      });
  };

  return (
    <div
      style={{ marginLeft: "0.5rem", marginRight: "0.5rem", marginTop: "1rem" }}
    >
      <div>
        <h3>feed 작성</h3>
        <div>
          <input
            className="title-input"
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            className="big-input"
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
      <div>
        <p className="adminfeed-title">타입 선택</p>
        <div>
          {typeOptions.map((type) => (
            <button
              className="adminfeed-button"
              key={type}
              onClick={() => handleTypeClick(type)}
              style={{
                backgroundColor: selectedType === type ? "#BCC5F7" : "#CFD0D1",
              }}
            >
              {type}
            </button>
          ))}
        </div>
        {showSubject && (
          <>
            <div className="line"></div>
            <p className="adminfeed-title">과목 선택</p>
            <div>
              {subjects.map((subject) => (
                <button
                  className="adminfeed-button"
                  key={subject}
                  onClick={() => handleSubjectClick(subject)}
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
                <p className="subtitle">예시: 물리1, 영어2, 통합과학</p>
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
          </>
        )}
        {showGrade && (
          <>
            <div className="line"></div>
            <p className="adminfeed-title">학년 선택</p>
            <div>
              {grades.map((grade) => (
                <button
                  className="adminfeed-button"
                  key={grade}
                  onClick={() => handleGradeClick(grade)}
                  style={{
                    backgroundColor: tags.includes(grade)
                      ? "lightgreen"
                      : "#CFD0D1",
                  }}
                >
                  {grade}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        className="ok-button"
        style={{ marginTop: "1rem" }}
        onClick={handleSubmit}
        disabled={isButtonDisabled() || button}
      >
        feed 올리기
      </button>
      <div className="margin"></div>
    </div>
  );
}
