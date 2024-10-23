import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method == "DELETE") {
    try {
      console.log(req.query);
      const result = await prisma.session.deleteMany({
        where: {
          userId: {
            equals: req.query.id,
          },
        },
      });
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting sessions" });
    }
  } else if (req.method == "GET") {
    try {
      const result = await prisma.session.findMany();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting sessions" });
    }
  }
}
