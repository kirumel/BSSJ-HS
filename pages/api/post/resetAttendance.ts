import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "PATCH") {
      await prisma.attendanceObject.updateMany({
        data: {
          comment: null,
          check: null,
          author: null,
        },
      });

      res.status(200).json({ message: "성공!" });
    } else {
      res.status(405).json({ message: "오류" });
    }
  } catch (error) {
    res.status(500).json({ error });
  } finally {
    await prisma.$disconnect();
  }
}
