import { prisma } from "../prisma/lib/prisma";

// pages/api/boards.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const boards = await prisma.board.findMany();
    return res.status(200).json(boards);
  }

  if (req.method === "POST") {
    const { name, description } = req.body;
    const newBoard = await prisma.board.create({
      data: { name, description },
    });
    return res.status(201).json(newBoard);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
