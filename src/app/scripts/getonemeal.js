import axios from "axios";

export async function getonemeal() {
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

    const response = await axios.get(
      "https://open.neis.go.kr/hub/mealServiceDietInfo",
      { params },
    );

    if (response.data?.RESULT?.CODE === "INFO-200") {
      meals.push({
        status: "error",
        date: `${month} / ${day}`,
        data: "급식정보 없음",
      });
      continue;
    }

    let dishes = response.data.mealServiceDietInfo[1].row[0].DDISH_NM.split(
      "<br/>",
    ).map((dish) => dish.split(" ")[0].replace("H", ""));

    meals.push({ status: "ok", date: `${month} / ${day}`, data: dishes });
  }

  return meals;
}
