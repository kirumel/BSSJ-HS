import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id;

  // postId가 유효한지 확인
  if (!postId) {
    return res.status(400).json({ error: "유효하지 않거나 누락된 postId" });
  }

  if (req.method === "GET") {
    try {
      // 특정 게시물의 좋아요를 모두 가져옴
      const likes = await prisma.like.findMany({
        where: { postId: postId },
      });
      return res.status(200).json(likes);
    } catch (error) {
      console.error("좋아요를 가져오는 데 실패했습니다:", error);
      return res
        .status(500)
        .json({ error: "좋아요를 가져오는 데 실패했습니다" });
    }
  } else if (req.method === "POST") {
    const { userId } = req.body; // 요청 본문에서 userId 추출

    // userId가 있는지 확인
    if (!userId) {
      return res.status(400).json({ error: "userId가 필요합니다" });
    }

    try {
      // 사용자가 이미 좋아요를 눌렀는지 확인
      const existingLike = await prisma.like.findFirst({
        where: {
          postId: postId,
          userId,
        },
      });

      // 이미 좋아요가 있는 경우, 제거 (좋아요 취소)
      if (existingLike) {
        await prisma.like.delete({
          where: { id: existingLike.id },
        });
        return res.status(200).json({ message: "좋아요 취소" });
      }

      // 그렇지 않으면 새로운 좋아요 생성
      const newLike = await prisma.like.create({
        data: {
          postId: postId,
          userId,
        },
      });

      return res.status(201).json(newLike);
    } catch (error) {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
      return res
        .status(500)
        .json({ error: "좋아요 처리 중 오류가 발생했습니다" });
    }
  } else {
    return res.status(405).json({ error: "허용되지 않은 메서드입니다" });
  }
}
