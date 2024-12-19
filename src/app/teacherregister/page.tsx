"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import "../accountregister/page.css";
import { Slide, ToastContainer, toast } from "react-toastify";

export default function Write() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    grade: "",
    clss: "",
    teacherCode: "",
  });

  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리의 이전 페이지로 이동
  };

  const isValidData = (teacherCode: string) => {
    if (teacherCode === "sj0010") {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "teacherCode") {
      isValidData(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/post/teacherRegist", formData);
      setIsChecked(false);
      if (response.status === 200) {
        toast.success("가입이 완료되었습니다!");

        router.push("/");
      } else {
        console.log(response.data.message);
        toast.error("가입 중 오류가 발생했습니다.");
        setIsChecked(true);
      }
    } catch (error) {
      toast.error("가입 중 오류가 발생했습니다.");
      setIsChecked(true);
    }
  };

  return (
    <div className="dish-display">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        closeButton={false}
      />
      <button className="back-button" onClick={handleBackClick}>
        <span>&larr;</span>
      </button>
      <div>
        <h3 style={{ margin: "0" }}>교사 회원가입</h3>
        <p className="subtitle" style={{ marginTop: "10", fontSize: "12px" }}>
          임시적으로 이메일 인증이 비활성화 되어있으며
          <br />
          교사 인증코드는 초대코드로 대체될 예정입니다
        </p>
        <form onSubmit={handleSubmit}>
          <input
            style={{
              marginTop: "20px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="email"
            placeholder="이메일"
            className="text-input"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            type="password"
            name="password"
            placeholder="비밀번호"
            className="text-input"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="text-input"
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="nickname"
            placeholder="닉네임"
            className="text-input"
            value={formData.nickname}
            onChange={handleChange}
          />
          <input
            className="text-input"
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="grade"
            placeholder="학년"
            value={formData.grade}
            onChange={handleChange}
          />
          <input
            className="text-input"
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="clss"
            placeholder="반"
            value={formData.clss}
            onChange={handleChange}
          />
          <input
            style={{
              marginTop: "5px",
              display: "block",
              fontSize: "11px",
              padding: "5px",
              borderRadius: "5px",
            }}
            name="teacherCode"
            placeholder="교사 인증코드"
            type="password"
            className="text-input"
            value={formData.teacherCode}
            onChange={handleChange}
          />
          <button
            className="ok-button"
            style={{ display: "block", marginTop: "30px", borderRadius: "5px" }}
            type="submit"
            disabled={!isChecked}
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
