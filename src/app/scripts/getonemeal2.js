import axios from "axios";

export async function getonemeal2() {
  const meals = [];
  for (let i = 0; i < 1; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    const params = {
      KEY: "ed2cb8a263374cd1a58583f767e73a31",
      Type: "json",
      ATPT_OFCDC_SC_CODE: "C10",
      SD_SCHUL_CODE: "7150455",
      MLSV_YMD: `${year}${month}${day}`,
    };

    try {
      const response = await axios.get(
        "https://open.neis.go.kr/hub/mealServiceDietInfo",
        { params }
      );

      console.log(response.data); // 데이터 구조 확인용 로그

      // API 응답이 급식 정보 없음일 때
      if (response.data?.RESULT?.CODE === "INFO-200") {
        meals.push({
          status: "error",
          date: `${month} / ${day}`,
          data: "급식정보 없음",
        });
        continue;
      }

      // mealServiceDietInfo가 존재하는지 확인 후 row 배열 검사
      const mealInfo = response.data.mealServiceDietInfo;
      if (
        !mealInfo ||
        !mealInfo[1] ||
        !mealInfo[1].row ||
        mealInfo[1].row.length === 0
      ) {
        meals.push({
          status: "error",
          date: `${month} / ${day}`,
          data: "급식정보 없음",
        });
        continue;
      }

      // DDISH_NM이 있는지 확인 후 처리
      const dishData = mealInfo[1].row[1]?.DDISH_NM;
      if (!dishData) {
        meals.push({
          status: "error",
          date: `${month} / ${day}`,
          data: "급식정보 없음",
        });
      } else {
        let dishes = dishData
          .split("<br/>")
          .map((dish) => dish.split(" ")[0].replace("H", ""));

        meals.push({ status: "ok", date: `${month} / ${day}`, data: dishes });
      }
    } catch (error) {
      console.error("Error fetching meal data:", error);
      meals.push({
        status: "error",
        date: `${month} / ${day}`,
        data: "급식 정보를 가져오는 중 오류 발생",
      });
    }
  }

  return meals;
}
