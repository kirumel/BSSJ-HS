import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method === "PATCH") {
    try {
      await prisma.attendanceObject.updateMany({
        data: {
          comment: null,
          check: null,
          author: null,
        },
      });

      res.status(200).json({ message: "성공!" });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(405).json({ message: "오류" });
  }
}
