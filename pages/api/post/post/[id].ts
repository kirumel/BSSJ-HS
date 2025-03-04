import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../prisma/lib/prisma";

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
          User: true,
        },
      });

      if (!post) {
        res.status(404).json({ error: "Post not found" });
      } else {
        res.status(200).json(post);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
