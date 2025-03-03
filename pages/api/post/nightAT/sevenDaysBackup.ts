import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../prisma/lib/prisma";
export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const [date, grade] = req.body;
    const dateob = new Date(date);
    const formattedDate = dateob.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    try {
      const dbcompare = await prisma.nightAttendanceObjectDB.findMany({
        where: {
          createdAt: {
            equals: formattedDate,
          },
          grade: grade.toString(),
          type: "pdf",
        },
      });

      const dbcompare2 = await prisma.nightAttendanceObjectDB.findMany({
        where: {
          createdAt: {
            equals: formattedDate,
          },
          grade: grade.toString(),
          type: "xlsx",
        },
      });
      if (dbcompare.length !== 0 && dbcompare2.length !== 0) {
        const students = await prisma.nightAtSupervisor.findMany({
          where: {
            createdAt: {
              equals: formattedDate,
            },
            grade: grade,
          },
        });
        if (students) {
          const move = await prisma.nightCompareAT2.createMany({
            data: {
              data: JSON.stringify(students),
              grade: grade.toString(),
              createdAt: formattedDate,
            },
          });

          const del = await prisma.nightAtSupervisor.deleteMany({
            where: {
              createdAt: formattedDate,
              grade: grade,
            },
          });
        }
      }
      res.status(200).json({ message: "성공" });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
