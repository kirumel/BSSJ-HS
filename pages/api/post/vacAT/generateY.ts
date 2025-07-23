import { prisma } from "../../prisma/lib/prisma";
export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const formattedDate = req.query.date;
    console.log(formattedDate);
    const result = await prisma.vacATSupervisor.findMany({
      where: {
        createdAt: formattedDate,
        grade: parseInt(req.query.grade, 10),
      },
    });
    if (result.length === 0) {
      res.status(203).json({ message: "No data found" });
    } else {
      res.status(200).json(result);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
