// pages/api/boards/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    const board = await prisma.board.findUnique({
      where: { id: id as string },
      include: { posts: true },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json(board);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
