import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: any, res: any) {
  const loginUrl = "https://bssj.riroschool.kr/ajax.php"; // 로그인 요청 URL
  const targetUrl =
    "https://bssj.riroschool.kr/portfolio.php?club=index&action=idx&db=1551&sort=dateup&t_year=2025&t_grade=&t_doc=&from=&t_year=1&s1=&key="; // 크롤링할 페이지 URL (페이지 번호는 별도 파라미터)
  const maxPages = 3; // 최대 페이지 수 설정 (필요시 변경)

  // 최종 결과를 저장할 배열 (여기서는 allAssignments 배열만 사용)
  const allAssignments: {
    teacherName: string;
    startDate: string;
    endDate: string;
    title: string;
    status: string;
    link: string;
  }[] = [];

  try {
    // 🔹 1. 로그인 요청 데이터 구성
    const loginData = new URLSearchParams();
    loginData.append("app", "user");
    loginData.append("mode", "login");
    loginData.append("userType", "1");
    loginData.append("id", "23-10607"); // 사용자 ID 입력
    loginData.append("pw", "dnd153973^^**"); // 비밀번호 입력
    loginData.append("deeplink", "");
    loginData.append("redirect_link", "");

    // 🔹 2. 로그인 요청 (초기)
    const loginResponse = await axios.post(loginUrl, loginData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://bssj.riroschool.kr/user.php?action=signin",
      },
      withCredentials: true, // 쿠키 포함
    });

    console.log("로그인 응답:", loginResponse.data);

    if (loginResponse.data.code !== "000") {
      console.error("로그인 실패:", loginResponse.data.msg);
      return res
        .status(401)
        .json({ error: `❌ 로그인 실패: ${loginResponse.data.msg}` });
    }

    // 🔹 3. 로그인 응답에서 토큰 & 쿠키 가져오기
    const token = loginResponse.data.token;
    const cookies = loginResponse.headers["set-cookie"]; // 쿠키 저장

    // 🔹 4. 세션 유지 가능한 axios 인스턴스 생성 (로그인 후 받은 토큰 및 쿠키 사용)
    const instance = axios.create({
      baseURL: "https://bssj.riroschool.kr",
      headers: {
        Authorization: `Bearer ${token}`, // 로그인 후 받은 토큰
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://bssj.riroschool.kr/user.php?action=signin",
        Cookie: cookies.join("; "), // 여러 쿠키가 있을 경우 세미콜론으로 연결
      },
      withCredentials: true,
    });

    // 🔹 5. 크롤링 수행 (페이지 번호 별로 요청)
    for (
      let pageNumber = 1;
      pageNumber <= 5 && pageNumber <= maxPages;
      pageNumber++
    ) {
      const response = await instance.get(`${targetUrl}?page=${pageNumber}`);
      const $ = cheerio.load(response.data);

      // 각 행을 순회하며 데이터 추출
      $("tbody tr").each((index, element) => {
        if (index === 0) return; // 첫 번째 행(제목 행) 스킵

        // 날짜 정보 추출 (7번째 td 요소)
        const dateElement = $(element).find("td").eq(6);
        const dateText = dateElement.html();
        let startDate = "";
        let endDate = "";

        if (dateText) {
          if (dateText.includes("<br>")) {
            const cleanedText = dateText
              .replace(/<strong>/g, "")
              .replace(/<\/strong>/g, "");
            const dates = cleanedText.split("<br>").map((date) => date.trim());
            startDate = dates[0];
            endDate = dates[1] || "";
          } else {
            console.log("dateText에 <br>이 없습니다.");
          }
        } else {
          console.log("날짜 정보가 없습니다.");
        }

        // 제목과 링크 추출
        const titleElement = $(element).find("td.tit a.txt");
        const title = titleElement.text().trim();
        const link = titleElement.attr("href")
          ? `https://bssj.riroschool.kr/${titleElement.attr("href")}`
          : "";

        // 교사 이름 추출 (6번째 td 요소)
        const teacherName = $(element).find("td").eq(5).text().trim();

        // 상태 정보 추출 (td.riro-label)
        const status = $(element)
          .find("td.state")
          .find(".riro-label")
          .text()
          .trim();

        // 모든 데이터가 있는 경우 배열에 추가
        if (startDate && endDate && title && link) {
          allAssignments.push({
            teacherName,
            startDate,
            endDate,
            title,
            status,
            link,
          });
        }
      });
    }

    // 크롤링이 완료된 후 한 번에 응답 반환
    res.status(200).json(allAssignments);
  } catch (error) {
    console.error("❗ 에러 발생:", error);
    res.status(500).json({ error: "❌ 데이터 가져오기 실패" });
  }
}
