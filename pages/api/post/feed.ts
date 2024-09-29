import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        where: {
          type: "feed",
        },
        include: {
          comments: true,
          likes: true,
          author: true,
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: `${error.message}` });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
