import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  console.log(req.body);
  if (req.method === "POST") {
    const createdAt = req.body.date.replace(/(\d{4})\. (\d{2})\. (\d{2})/);
    try {
      const findDB = await prisma.attendanceObjectDB3.findMany({
        where: {
          createdAt: req.body.date,
          type: req.body.type,
        },
      });
      if (findDB.length === 0) {
        res.status(400).json({ message: "해당 날자에 파일이 없습니다" });
      } else {
        res.status(200).json(findDB);
      }
    } catch (error) {
      res.status(400).json({ message: `오류발생${error} ` });
    }
  }
}
