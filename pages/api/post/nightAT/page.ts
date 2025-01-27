import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const findDB = await prisma.nightAtSupervisor.createMany({
        data: req.body,
      });
      if (findDB.length === 0) {
        res.status(400).json({ message: "해당 날자에 파일이 없습니다" });
      } else {
        res.status(200).json(findDB);
      }
    } catch (error) {
      res.status(400).json({ message: `오류발생${error} ` });
    }
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
