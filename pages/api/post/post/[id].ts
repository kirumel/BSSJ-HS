import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const { id } = req.query;

    try {
      const post = await prisma.post.findFirst({
        where: {
          id: id as string,
        },
        include: {
          comments: true,
          likes: true,
          author: true,
        },
      });

      if (!post) {
        res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  }
}
