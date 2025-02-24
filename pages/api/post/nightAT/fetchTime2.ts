import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "PATCH") {
    try {
      req.body.firstcommitstudent.map(async (a: any) => {
        const { id, outTimeST, check, comment, outTimeT } = a;
        let timedata = outTimeST;

        if (outTimeT == outTimeST) {
          timedata = null;
        }

        const PATCH = await prisma.nightAtSupervisor.updateMany({
          where: { id: { equals: id } },
          data: {
            outTimeST: timedata,
            check: check,
            comment: comment,
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
