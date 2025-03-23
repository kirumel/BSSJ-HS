"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
interface FileStatusType {
  compareATNight23: boolean;
  compareATNight22: boolean;
  compareATNight21: boolean;
  compareATNight1: boolean;
  compareATNight3: boolean;
  night: boolean;
  night2: boolean;
  night3: boolean;
  compareATNight: boolean;
  compareATNight2: boolean;
  compareAT8: boolean;
  compareAT82: boolean;
  compareAT83: boolean;
  grade1: boolean;
  grade2: boolean;
  grade3: boolean;
}
const FileStatusDashboard = () => {
  const [Status, setStatus] = useState<FileStatusType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/takeAT") // 실제 API 경로로 변경
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
      })
      .then((data) => {
        setStatus(data.fileStatus);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!Status) return <div>데이터 없음 ❌</div>;
  return (
    <div className="file-status-dashboard">
      <h3 className="title" style={{ textAlign: "right" }}>
        파일 생성 상태📄
      </h3>
      <h3 className="title">8 출석 파일 📁</h3>
      <div className="file-status-list">
        <div>1학년 출석 파일: {Status.grade1 ? "생성됨 ✅" : "미생성 ❌"}</div>
        <div>2학년 출석 파일: {Status.grade2 ? "생성됨 ✅" : "미생성 ❌"}</div>
        <div>3학년 출석 파일: {Status.grade3 ? "생성됨 ✅" : "미생성 ❌"}</div>
        <div>---------------</div>
        <div>
          1학년 비교 파일: {Status.compareAT8 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>
          2학년 비교 파일: {Status.compareAT82 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>
          3학년 비교 파일: {Status.compareAT83 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
      </div>
      <h3 className="title">야자 출석 파일 📁</h3>
      <div className="file-status-list">
        <div>1학년 츨석부 :{Status.night ? "생성됨 ✅" : "미생성 ❌"}</div>
        <div>2학년 츨석부 :{Status.night2 ? "생성됨 ✅" : "미생성 ❌"}</div>
        <div>3학년 츨석부 :{Status.night3 ? "생성됨 ✅" : "미생성 ❌"}</div>
        <div>---------------</div>
        <div>
          1학년 당일 비교용 파일:
          {Status.compareATNight1 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>
          2학년 당일 비교용 파일:
          {Status.compareATNight2 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>
          3학년 당일 비교용 파일:
          {Status.compareATNight3 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>---------------</div>
        <div>
          1학년 일주일 저장 / 비교용 파일 :
          {Status.compareATNight21 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>
          2학년 일주일 저장 / 비교용 파일:
          {Status.compareATNight22 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
        <div>
          3학년 일주일 저장 / 비교용 파일 :
          {Status.compareATNight23 ? "생성됨 ✅" : "미생성 ❌"}
        </div>
      </div>
      <div className="margin"></div>
    </div>
  );
};

export default FileStatusDashboard;
