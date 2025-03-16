import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method === "PATCH") {
    const { id, session } = req.body;
    console.log(session);
    try {
      await prisma.nightAtSupervisor.updateMany({
        where: {
          name: { equals: session.name },
          grade: { equals: session.grade },
          class: { equals: session.class },
          studentnumber: { equals: session.studentnumber },
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
