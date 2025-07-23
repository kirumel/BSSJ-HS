import { prisma } from "../../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  const { date, grade } = req.body;

  if (req.method === "POST") {
    const dotDate = date.replace(/-/g, ". ") + ".";

    console.log(dotDate, grade); // 점 형식으로 출력됨

    const result = await prisma.vacATSupervisor.findMany({
      where: {
        createdAt: dotDate,
        grade: grade,
      },
    });

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
