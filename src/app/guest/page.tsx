"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import "../accountregister/page.css";
import { Slide, ToastContainer, toast } from "react-toastify";

// 폼 데이터 타입 정의
interface FormData {
  email: string;
  password: string;
  name: string;
  nickname: string;
  grade: string;
  clss: string;
}

export default function Write() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    nickname: "",
    grade: "",
    clss: "",
  });

  const handleBackClick = () => {
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    // 모든 필드가 작성되었는지 확인
    const allFieldsFilled = Object.values(updatedFormData).every(
      (field) => field.trim() !== ""
    );

    // 학년과 반이 숫자인지 확인
    const isGradeAndClassNumeric =
      !isNaN(Number(updatedFormData.grade)) &&
      !isNaN(Number(updatedFormData.clss));

    setIsChecked(allFieldsFilled && isGradeAndClassNumeric);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsChecked(false);
      const response = await axios.post("/api/post/guest", formData);
      if (response.status === 200) {
        alert("가입이 완료되었습니다!");
        router.push("/");
      } else {
        console.error(response.data.message);
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
        <h3 style={{ margin: "0" }}>게스트 회원가입</h3>
        <p className="subtitle" style={{ marginTop: "10", fontSize: "12px" }}>
          임시적으로 이메일 인증이 <br />
          비활성화 되어있는 회원가입 입니다
        </p>
        <form onSubmit={handleSubmit}>
          {["email", "password", "name", "nickname", "grade", "clss"].map(
            (field, index) => (
              <input
                key={index}
                style={{
                  marginTop: index === 0 ? "20px" : "5px",
                  display: "block",
                  fontSize: "11px",
                  padding: "5px",
                  borderRadius: "5px",
                }}
                name={field}
                placeholder={
                  field === "email"
                    ? "이메일"
                    : field === "password"
                    ? "비밀번호"
                    : field === "name"
                    ? "이름"
                    : field === "nickname"
                    ? "닉네임"
                    : field === "grade"
                    ? "학년"
                    : "반"
                }
                className="text-input"
                value={(formData as any)[field]}
                onChange={handleChange}
                type={field === "password" ? "password" : "text"}
              />
            )
          )}
          <button
            className="ok-button"
            style={{
              display: "block",
              marginTop: "30px",
              borderRadius: "5px",
            }}
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
