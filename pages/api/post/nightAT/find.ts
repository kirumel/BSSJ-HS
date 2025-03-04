import { prisma } from "../../prisma/lib/prisma";
export default async function handler(req: any, res: any) {
  const { date, grade } = req.body;
  if (req.method === "POST") {
    const result = await prisma.nightAtSupervisor.findMany({
      where: {
        createdAt: date,
        grade: grade,
      },
    });
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
