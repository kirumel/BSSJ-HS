"use client";
import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const [link, setlink] = useState("");
  const [type, settype] = useState("");
  function pdfDownload() {
    axios
      .post("/api/post/attendancedb", {
        date: datavisible,
        type: "pdf",
      })
      .then((response) => {
        setlink(response.data[0].link);
        settype("pdf");
      })
      .catch((error) => {
        if (error.response) {
          // 서버가 응답을 했지만, 응답 코드가 오류인 경우
          console.error("서버 응답 오류 메시지:", error.response.data.message);
          alert(error.response.data.message);
        } else if (error.request) {
          // 요청이 서버로 전송되었지만 응답이 없는 경우
          console.error("서버 응답 없음:", error.request);
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 오류가 발생한 경우
          console.error("요청 설정 오류:", error.message);
        }
      });
  }
  function excelDownload() {
    axios
      .post("/api/post/attendancedb", {
        date: datavisible,
        type: "excel",
      })
      .then((response) => {
        const base64Data = response.data[0].link;
        settype("xlsx");

        // Base64 문자열을 이진 데이터로 변환
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Blob URL 생성
        const url = URL.createObjectURL(blob);
        setlink(url);
      })
      .catch((error) => {
        if (error.response) {
          // 서버가 응답을 했지만, 응답 코드가 오류인 경우
          console.error("서버 응답 오류 메시지:", error.response.data.message);
          alert(error.response.data.message);
        } else if (error.request) {
          // 요청이 서버로 전송되었지만 응답이 없는 경우
          console.error("서버 응답 없음:", error.request);
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 오류가 발생한 경우
          console.error("요청 설정 오류:", error.message);
        }
      });
  }
  const [startDate, setStartDate] = useState(new Date());
  const datavisible = startDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={(date) => date !== null && setStartDate(date)}
      />
      <button onClick={pdfDownload}>PDF</button>
      <button onClick={excelDownload}>Excel</button>
      <a href={link} download={`attendanceDB.${type}`}>
        다운
      </a>
    </>
  );
}
