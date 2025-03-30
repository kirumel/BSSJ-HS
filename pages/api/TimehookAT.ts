import { prisma } from "./prisma/lib/prisma";
import { startOfWeek, endOfWeek, format } from "date-fns";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const now = new Date();

      const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
      const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });

      const formattedStart = format(startOfThisWeek, "yyyy-MM-dd");
      const formattedEnd = format(endOfThisWeek, "yyyy-MM-dd");

      // DB에서 해당 주의 데이터 가져오기
      const getATNight = await prisma.nightCompareAT2.findMany({
        where: {
          createdAt: {
            gte: formattedStart,
            lte: formattedEnd,
          },
        },
      });

      console.log(getATNight);
      res.status(200).json(getATNight);
    } catch (error) {
      res.status(400).json({ message: `오류 발생: ${error.message}` });
    }
  } else {
    res.status(405).json({ message: "허용되지 않은 메서드입니다" });
  }
}
