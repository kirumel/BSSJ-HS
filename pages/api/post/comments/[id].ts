import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id;

  if (req.method === "GET") {
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: {
        user: true,
      },
    });
    return res.status(200).json(comments);
  } else if (req.method === "POST") {
    // 댓글 작성
    const { userId, content, author } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        postId: postId,
        userId,
        author,
        content,
      },
    });
    return res.status(201).json(newComment);
  }
}
