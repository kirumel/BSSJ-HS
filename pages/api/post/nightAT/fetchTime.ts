import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "PATCH") {
    try {
      req.body.firstcommitstudent.map(async (a: any) => {
        const { id, outTimeT } = a;

        const PATCH = await prisma.nightAttendanceObject.updateMany({
          where: { id: { equals: id } },
          data: {
            outTimeT: outTimeT,
          },
        });
        console.log(PATCH);
        res.status(200).json(PATCH);
      });
    } catch (error) {
      res.status(400).json({ message: `오류발생${error} ` });
    }
  }
}
