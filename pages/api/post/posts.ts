import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: {
          comments: true,
          likes: true,
          author: true,
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "게시물을 가져오는 데 실패했습니다" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    const { title, content, nickname, authorId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "제목이 비어있습니다" });
    }
    if (!content) {
      return res.status(400).json({ message: "내용이 비어있습니다" });
    }
    if (!authorId) {
      return res.status(400).json({ message: "로그인이 필요합니다" });
    }
    if (!nickname) {
      return res.status(400).json({ message: "닉네임을 설정해주세요" });
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          nickname,
          authorId,
        },
      });
      res.redirect(307, `/cafe`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "오류가 발생했습니다 콘솔을 확인해주세요" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
