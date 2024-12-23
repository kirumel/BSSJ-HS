import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { nameid } = req.query.nameid;
      const findDB = await prisma.eventQR.findMany({
        where: {
          nameid: nameid,
        },
      });
      res.status(200).json(findDB);
    } catch (error) {
      res.status(202).json({ message: `오류발생${error} ` });
    }
  } else if (req.method === "POST") {
    try {
      const { qr, nameid } = req.body;
      const qrArray = [
        "Sj1",
        "Sj2",
        "Sj3",
        "Sj4",
        "Sj5",
        "Sj6",
        "Sj7",
        "DB98-32905B-00<NUL>",
      ];
      if (!qrArray.includes(qr)) {
        res.status(202).json({
          message: `허용되지 않는 코드입니다`,
        });
      } else {
        const findDB = await prisma.eventQR.findMany({
          where: {
            qrcode: qr,
            nameid: nameid,
          },
        });
        const hiddenfindDB = await prisma.eventQR.findMany({
          where: {
            qrcode: "DB98-32905B-00",
          },
        });
        if (findDB.length > 0) {
          res.status(202).json({
            message: `이미 스켄된 ${qr.toString().slice(2)}번째 코드입니다`,
          });
        } else {
          if (qr === "DB98-32905B-00" && hiddenfindDB.length < 5) {
            const post = await prisma.eventQR.create({
              data: {
                nameid: nameid,
                qrcode: qr,
              },
            });
            res.status(200).json({ message: "히든 qr 획득!" });
          } else if (qr === "DB98-32905B-00" && hiddenfindDB.length > 5) {
            res.status(202).json({
              message: `아쉽게도 히든 qr은 모두 소진되었습니다`,
            });
          } else {
            const post = await prisma.eventQR.create({
              data: {
                nameid: nameid,
                qrcode: qr,
              },
            });
            res.status(200).json({ message: qr.toString().slice(2) });
          }
        }
      }
    } catch (error) {
      res.status(202).json({ message: `오류발생${error} ` });
    }
  }
}
