import { prisma } from "../../prisma/lib/prisma";
export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const result = await prisma.nightAtSupervisor.findMany({});
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
