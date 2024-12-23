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

      const findDB = await prisma.eventQR.findMany({
        where: {
          qrcode: nameid,
          nameid: nameid,
        },
      });
      if (findDB.length > 0) {
        res.status(202).json({
          message: `이미 상품을 획득한 id입니다`,
        });
      } else {
        const post = await prisma.eventQR.create({
          data: {
            nameid: nameid,
            qrcode: nameid,
          },
        });
        res.status(200).json({ message: "성공" });
      }
    } catch (error) {
      res.status(202).json({ message: `오류발생${error} ` });
    }
  }
}
