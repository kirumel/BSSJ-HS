import { prisma } from "../prisma/lib/prisma";

export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      const todayDate = new Date();

      // 날짜 보기 좋게 설정
      let formattedDate: string;

      formattedDate = todayDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const dbcompare = await prisma.compareAT.findMany({
        where: {
          createdAt: {
            equals: formattedDate,
          },
        },
      });
      res.status(200).json(dbcompare);
    } catch (error) {
      res.status(500).json({ message: "Error getting sessions" });
    }
  }
}
