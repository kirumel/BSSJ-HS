import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method === "PATCH") {
    const { id, session } = req.body;

    try {
      const result = await prisma.nightAtSupervisor.updateMany({
        where: {
          name: { equals: session.user.name },
          grade: { equals: session.user.grade },
          class: { equals: session.user.class },
          studentnumber: { equals: session.user.studentnumber },
        },
        data: {
          code: id,
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
