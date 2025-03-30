import React from "react";
import "./style.css";

type Props = {
  totalTime: number; // 누적 공부 시간 (시간 단위, 예: 5.5)
  maxTime?: number; // 진행바 기준 최대 시간 (기본값 5시간)
};

const HalfCircleProgressBar: React.FC<Props> = ({ totalTime, maxTime = 5 }) => {
  // maxTime을 넘지 않는 값으로 클램핑 (진행바는 maxTime 기준으로 채워짐)
  const clampedTime = Math.min(totalTime, maxTime);
  const percentage = (clampedTime / maxTime) * 100;

  // 반원의 반지름 및 둘레 계산
  const radius = 90;
  const circumference = Math.PI * radius; // 반원 길이 (실제 반원의 길이이므로, 채우는 길이로 사용)

  // 진행바 길이 계산
  const filledLength = (percentage / 100) * circumference;
  const dashArray = `${filledLength} ${circumference - filledLength}`;

  // 누적 시간을 시간과 분으로 변환
  const hours = Math.floor(totalTime);
  const minutes = Math.round((totalTime - hours) * 60);

  return (
    <div className="progress-container">
      <svg width="90" viewBox="0 0 200 120">
        {/* 배경 반원 */}
        <path
          d="M10,110 A90,90 0 0,1 190,110"
          fill="none"
          stroke="#ddd"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* 진행 바 */}
        <path
          d="M10,110 A90,90 0 0,1 190,110"
          fill="none"
          stroke="rgb(138, 156, 255)"
          strokeWidth="20"
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
      <div className="progress-text">📖</div>
    </div>
  );
};

export default HalfCircleProgressBar;
