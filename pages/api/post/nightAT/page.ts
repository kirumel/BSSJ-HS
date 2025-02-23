import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const findDB = await prisma.nightAtSupervisor.findMany({});
      res.status(200).json(findDB);
    } catch (error) {
      res.status(400).json({ message: `오류발생${error} ` });
    }
  }
  //감독관 학생 등록
  if (req.method === "POST") {
    const todayDate = new Date();
    const formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const compareATdata = await prisma.nightCompareAT.findMany({
      where: {
        createdAt: {
          equals: formattedDate,
        },
        grade: {
          equals: req.body.grade.toString(),
        },
      },
    });

    if (compareATdata.length === 0 || !compareATdata[0]?.data) {
      await Promise.all(
        req.body.firstcommitstudent.map(async (a: any) => {
          const move = await prisma.nightAtSupervisor.createMany({
            data: {
              id: a.id,
              name: a.name,
              studentnumber: a.studentnumber,
              outTimeT: a.outTimeT,
              author: a.author,
              class: a.class,
              grade: a.grade,
            },
          });

          return move;
        })
      );
    }

    res.status(200).json({ message: "성공" });
  } else if (req.method === "PATCH") {
    try {
      const findDB = await prisma.nightAtSupervisor.findMany({
        where: {
          createdAt: req.body.date,
          studentnumber: req.body.number,
        },
      });
      if (findDB.length !== 0) {
        if (findDB.find((a: any) => a.outTime) === undefined) {
          res.status(202).json({ message: "이미 퇴실 완료된 학생입니다" });
        } else {
          const updateDB = prisma.nightAtSupervisor.updateMany({
            where: {
              createdAt: req.body.date,
              studentnumber: req.body.number,
            },
            data: {
              outTime: req.body.outTime,
              author: req.body.author,
            },
          });
          res.status(200).json({ message: "성공" });
        }
      } else {
        res.status(202).json({ message: "야자 미참여 학생입니다" });
      }
    } catch (error) {
      res.status(400).json({ message: `오류발생${error} ` });
    }
  }
}
