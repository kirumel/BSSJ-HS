import { Prisma } from "@prisma/client";
import { prisma } from "./prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method == "GET") {
    const todayDate = new Date();

    //날자 보기좋게
    let formattedDate: string;

    formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    try {
      const getstudent1 = await prisma.attendanceObjectDB.findMany({
        where: {
          createdAt: formattedDate,
        },
      });
      const getstudent2 = await prisma.attendanceObjectDB2.findMany({
        where: {
          createdAt: formattedDate,
        },
      });
      const getstudent3 = await prisma.attendanceObjectDB3.findMany({
        where: {
          createdAt: formattedDate,
        },
      });

      const getReq = await prisma.nightAttendanceObjectDB.findMany({
        where: {
          createdAt: formattedDate,
        },
      });
      res.status(200).send(getReq, getstudent1, getstudent2, getstudent3);
    } catch (error) {
      res.status(400).send("error");
    }
  }
}
