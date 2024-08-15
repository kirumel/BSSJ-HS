"use client";
import axios from "axios";

export default async function getSchedules() {
  const schedules = [];
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  // 오늘 날짜를 가져옵니다.
  let getday = date.getDate();
  let currentDay = date.getDay(); // 0: 일요일, 1: 월요일
  let day = getday - currentDay + 1;
  let week = 1;
  const grade = localStorage.getItem("grade") || "2"; // localStorage에서 등급 정보를 가져옵니다.
  const clss = localStorage.getItem("clss") || "3"; // localStorage에서 반 정보를 가져옵니다.

  for (let i = 0; i < 5; i++) {
    const params = {
      KEY: "ed2cb8a263374cd1a58583f767e73a31",
      Type: "json",
      ATPT_OFCDC_SC_CODE: "C10",
      SD_SCHUL_CODE: "7150455",
      GRADE: grade,
      CLASS_NM: clss,
      ALL_TI_YMD: `${year}${month}${day.toString().padStart(2, "0")}`,
    };

    const apiUrl = "https://open.neis.go.kr/hub/hisTimetable";
    const response = await axios.get(apiUrl, { params });

    if (response.data?.RESULT?.CODE === "INFO-200") {
      schedules.push({
        status: "정보없음",
        grade: grade,
        class: clss,
        date: `${month} / ${day}`,
        dayofweek: week,
      });
    } else if (Array.isArray(response.data?.hisTimetable)) {
      const schedule = response.data.hisTimetable[1]?.row || []; // 배열의 첫 번째 요소에서 데이터를 가져옴
      const todaySchedule = schedule.map((item) => item?.ITRT_CNTNT); // 해당 요소가 있는 경우 데이터 추출
      const perio = schedule.map((item) => item?.PERIO);

      // perio에 1부터 7까지가 없으면 해당 번째에 string 추가
      for (let i = 1; i <= 7; i++) {
        if (!perio.includes(i.toString())) {
          const index = perio.findIndex((num) => parseInt(num) > i);
          todaySchedule.splice(
            index !== -1 ? index : todaySchedule.length,
            0,
            "채플or미등록"
          );
        }
      }

      schedules.push({
        status: "ok",
        grade: grade,
        class: clss,
        date: `${month} / ${day}`,
        data: todaySchedule,
        perio: perio,
        dayofweek: week,
      });
    }

    // 다음 날짜로 설정
    day++;
    currentDay = currentDay + 1;
    week = week + 1;
  }

  return schedules;
}
