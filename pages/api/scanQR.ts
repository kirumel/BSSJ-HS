import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const { qr, nameid } = req.body;
      const post = await prisma.eventQR.create({
        data: {
          nameid: nameid,
          qrcode: qr,
        },
      });
      res.status(200).json(qr.toString().slice(2));
    } catch (error) {
      res.status(202).json({ message: `오류발생${error} ` });
    }
  }
}
