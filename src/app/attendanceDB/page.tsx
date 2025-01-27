"use client";
import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

import "./style.css";

export default function Page() {
  const [link, setLink] = useState("");
  const [type, setType] = useState("");
  const [grade, setGrade] = useState("null");
  const [startDate, setStartDate] = useState(new Date());

  const datavisible = startDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const pdfDownload = () => {
    if (grade === "null") {
      alert("학년을 선택해주세요");
    } else {
      axios
        .post(`/api/post/attendancedb${grade}`, {
          date: datavisible,
          type: "pdf",
        })
        .then((response) => {
          setLink(response.data[0].link);
          setType("pdf");
        })
        .catch(handleError);
    }
  };

  const excelDownload = () => {
    if (grade === "null") {
      alert("학년을 선택해주세요");
    } else {
      axios
        .post(`/api/post/attendancedb${grade}`, {
          date: datavisible,
          type: "excel",
        })
        .then((response) => {
          const base64Data = response.data[0].link;
          setType("xlsx");

          const byteCharacters = atob(base64Data);
          const byteNumbers = Array.from(byteCharacters, (char) =>
            char.charCodeAt(0)
          );
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const url = URL.createObjectURL(blob);
          setLink(url);
        })
        .catch(handleError);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error("서버 응답 오류 메시지:", error.response.data.message);
      alert(error.response.data.message);
    } else if (error.request) {
      console.error("서버 응답 없음:", error.request);
    } else {
      console.error("요청 설정 오류:", error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 115px)",
      }}
    >
      <div>
        <DatePicker
          className="datepicker"
          selected={startDate}
          locale={ko}
          dateFormat="yyyy-MM-dd"
          onChange={(date) => date !== null && setStartDate(date)}
        />
      </div>
      <div>
        <select
          className="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="null">학년 선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>
      <div>
        <button className="grade" onClick={pdfDownload}>
          PDF
        </button>
        <button className="grade" onClick={excelDownload}>
          Excel
        </button>
      </div>

      {link && (
        <div style={{ width: "80vw", marginTop: "10px" }}>
          <a href={link} download={`attendanceDB.${type}`}>
            <button className="ok-button">다운</button>
          </a>
        </div>
      )}
    </div>
  );
}
