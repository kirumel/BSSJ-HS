import { prisma } from "../../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const atData = await prisma.attendanceObject.findMany({
        where: {
          grade: req.body.grade,
          class: req.body.class,
        },
      });

      const postNightAt = await prisma.nightAttendanceObject.createMany({
        data: atData.map((a: any) => ({
          createdAt: a.createdAt,
          studentnumber: a.studentnumber,
          author: a.author,
          class: a.class,
          grade: a.grade,
          name: a.name,
        })),
      });

      if (atData.length === 0) {
        res.status(400).json({ message: "해당 날자에 파일이 없습니다" });
      } else {
        res.status(200).json("성공!");
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(400).json({ message: `오류발생 ${error.message}` });
  }
}
