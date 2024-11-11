"use client";
import React, { useState } from "react";
import "./style.css";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [faqVisible, setFaqVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("성공!");
    setFormData({ name: "", email: "", message: "" });
  };

  const toggleFaq = () => {
    setFaqVisible(!faqVisible);
  };

  return (
    <div className="support-container">
      <h1>지원 페이지</h1>

      <h2>문의하기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="문의 사항을 입력하세요"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">제출</button>
      </form>

      <h2 onClick={toggleFaq} style={{ cursor: "pointer" }}>
        자주 묻는 질문 {faqVisible ? "▲" : "▼"}
      </h2>
      {faqVisible && (
        <div className="faq">
          <p>
            <strong>질문 1:</strong> 뭐하는 앱인가요?
          </p>
          <p>성지고 학생들을 위해 만들어진 앱 입니다</p>
          <p>
            <strong>질문 2:</strong> 문제를 보고하려면 어떻게 하나요?
          </p>
          <p>답변: 위 내용에 적어주시면 됩니다</p>
        </div>
      )}
    </div>
  );
}
