import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const { qr, nameid } = req.body;
      const qrArray = ["sj1", "sj2", "sj3", "sj4", "sj5", "sj6", "sj7"];
      if (qrArray.includes(qr)) {
        res.status(202).json({
          message: `허용되지 않는 코드입니다다`,
        });
      } else {
        const findDB = await prisma.eventQR.findMany({
          where: {
            qrcode: qr,
            nameid: nameid,
          },
        });
        if (findDB.length > 0) {
          res.status(202).json({
            message: `이미 스켄된 ${qr.toString().slice(2)}번째 코드입니다`,
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
    } catch (error) {
      res.status(202).json({ message: `오류발생${error} ` });
    }
  }
}
