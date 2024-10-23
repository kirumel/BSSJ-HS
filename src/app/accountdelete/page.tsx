"use client";

import "../accountregister/page.css";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.png";
import Image from "next/image";
export default function Page() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리의 이전 페이지로 이동
  };
  return (
    <>
      <div className="nav">
        <Image src={logo} alt="logo" width={71} height={25} />
      </div>
      <div className="right-left-margin home-layout">
        <button className="back-button" onClick={handleBackClick}>
          <span>&larr;</span>
        </button>
        <h2>
          SJHS helper
          <br />
          부산 성지고등학교 app 계정 문의
        </h2>
        <h3>계정을 어떻게 삭제하나요?</h3>
        <p>성지고등학교 앱 내 고객센터를 통해 문의주시면 삭제를 도와드립니다</p>
        <p>1. 이메일과 자신을 인증할 학생증이 필요합니다</p>
        <p>
          2. 내용에 이메일과 학생증을 첨부하고 연락할 수 있는 이메일이나 인스타
          아이디를 기제해주시면 됩니다
        </p>
        <p>추후 계정 삭제기능이 마이 탭에 추가될 예정입니다</p>
        <br />
        <br />
        <p>계정을 삭제 후 최대 5년동안 altisto는 개인정보를 보관하게 됩니다</p>
      </div>
    </>
  );
}
