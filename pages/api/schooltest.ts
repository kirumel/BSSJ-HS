import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const maxPages = 10; // 가져올 최대 페이지 수
  const allPosts = []; // 모든 게시물을 저장할 배열
  const uniqueLinks = new Set(); // 중복된 링크를 추적할 Set

  try {
    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      const response = await axios.post(
        `https://school.busanedu.net/bssj-h/na/ntt/selectNttList.do?mi=608110&bbsId=1059514&currPage=${pageNumber}`
      );

      const $ = cheerio.load(response.data); // Cheerio로 HTML 데이터 로드

      // ta_l 클래스를 가진 td 요소 선택
      $("td.ta_l").each((index, element) => {
        const link = $(element).find("a").attr("href"); // href 가져오기
        const text = $(element).find("a").text().trim(); // 텍스트 가져오기

        // 중복된 링크가 아닐 경우에만 추가
        if (link && !uniqueLinks.has(link)) {
          uniqueLinks.add(link); // 링크를 Set에 추가
          allPosts.push({ link, text }); // 각 게시물 추가
        }
      });
    }

    // 중복된 게시물 삭제: allPosts에서 unique한 게시물만 남김
    const uniquePosts = allPosts.filter(
      (post, index, self) =>
        index === self.findIndex((p) => p.link === post.link)
    );

    res.status(200).json(uniquePosts); // 모든 게시물 데이터 응답
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" }); // 에러 응답
  }
}
