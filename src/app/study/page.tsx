"use client";
import axios from "axios";
import "./style.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import HalfCircleProgressBar from "./HalfCircleProgressBar"; // 경로는 파일 위치에 맞게 수정

export default function Home() {
  const { data: session } = useSession();
  const [time, setTime] = useState<any[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);

  // 시간 계산 함수 (startTime과 endTime을 비교하여 시간 차이 계산)
  const calculateStudyTime = (startTime: string, endTime: string | null) => {
    if (!endTime) return 0; // 종료 시간이 없으면 0을 반환
    // createdAt 날짜를 이용하여 Date 객체 생성 (여기서는 createdAt 날짜 대신 예시 날짜 사용)
    const date = "2025-03-28";
    const startDate = new Date(`${date}T${startTime}:00`);
    const endDate = new Date(`${date}T${endTime}:00`);
    return (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60; // 시간 차이를 시간 단위로 계산
  };

  // 소수시간을 "X시간 Y분" 문자열로 변환하는 함수
  const convertDecimalTimeToHM = (decimalTime: number) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours}시간 ${minutes}분`;
  };

  // 오늘 날짜 형식 (예: "2025. 03. 28.")
  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 오늘 참여 시간 계산
  const todayStudyTime = time.filter(
    (item: any) => item.createdAt === formattedDate
  );
  const todayStudyTime2 = todayStudyTime.reduce((acc: number, item: any) => {
    const studyTime = calculateStudyTime(
      item.startTime,
      item.outTime || item.outTimeT || item.outTimeST
    );
    return acc + studyTime;
  }, 0);

  useEffect(() => {
    axios.get("api/TimehookAT").then((res) => {
      const ATSdata = res.data
        .map((item: any) => {
          return JSON.parse(item.data).filter(
            (item: any) =>
              item.name === session?.user?.name &&
              item.class === session?.user?.class &&
              item.grade === session?.user?.grade
          );
        })
        .flat();

      setTime(ATSdata);

      // outTime 값이 "0"인 항목을 제외한 데이터
      const filteredData = ATSdata.filter(
        (item: any) => (item.outTime || item.outTimeT || item.outTimeST) !== "0"
      );

      // 일주일 누적 시간 계산
      const totalTime = filteredData.reduce((acc: number, item: any) => {
        const studyTime = calculateStudyTime(
          item.startTime,
          item.outTime || item.outTimeT || item.outTimeST
        );
        return acc + studyTime;
      }, 0);

      setTotalStudyTime(totalTime);
    });
  }, [session]);

  return (
    <div>
      <div className="right-left-margin">
        <div className="night-container">
          <HalfCircleProgressBar totalTime={totalStudyTime} maxTime={5} />
          <h3 className="night-title">일주일 누적 야자 참여 시간</h3>
          <p className="night-title2">
            {convertDecimalTimeToHM(totalStudyTime)}
          </p>
        </div>

        <div className="scroll-containerT">
          <div className="night-containerT">
            <h3 className="night-titleT">오늘의 야자 참여 시간</h3>
            <p className="night-titleT2">
              {convertDecimalTimeToHM(todayStudyTime2) == "0시간 0분"
                ? "출석이 완료되지 않았습니다"
                : convertDecimalTimeToHM(todayStudyTime2)}
            </p>
          </div>
          {time.length === 0 && <p>출석이 완료된 항목이 없습니다</p>}

          {time.map((item: any, index: number) => (
            <div key={index}>
              <div className="time-T">
                <div className="display-flexStudy">
                  <div>{item.createdAt}</div>
                  <div>
                    퇴장 :{" "}
                    {(item.outTime || item.outTimeT || item.outTimeST) !== "0"
                      ? item.outTime || item.outTimeT || item.outTimeST
                      : "미출석"}
                  </div>
                </div>
                <div
                  className="timeCheck"
                  style={{
                    backgroundColor:
                      item.check == "1" ? "" : "rgb(255, 150, 150)",
                  }}
                >
                  {item.check == "1" ? "출석" : "미출석"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
