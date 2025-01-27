import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: any, res: any) {
  const maxPages = 1;
  const allPosts: { link: string; text: string }[] = [];
  const uniqueLinks = new Set();

  try {
    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      const response = await axios.post(
        `https://school.busanedu.net/bssj-h/na/ntt/selectNttList.do?mi=608110&bbsId=1059514&currPage=${pageNumber}`
      );

      const $ = cheerio.load(response.data);

      $("td.ta_l").each((index, element) => {
        const link = $(element).find("a").attr("href");
        const text = $(element).find("a").text().trim();

        if (link && !uniqueLinks.has(link)) {
          uniqueLinks.add(link);
          allPosts.push({ link, text });
        }
      });
    }

    const uniquePosts = allPosts.filter(
      (post, index, self) =>
        index === self.findIndex((p) => p.link === post.link)
    );

    res.status(200).json(uniquePosts);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
