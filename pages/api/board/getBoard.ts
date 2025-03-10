import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Method not allowed" });
  }
  if (req.method == "GET") {
    try {
      const result = await prisma.board.findMany();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting board" });
    }
  }
}
