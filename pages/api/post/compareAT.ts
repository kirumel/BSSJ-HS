import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const todayDate = new Date();
  console.log(req.body);

  //날자 보기좋게
  let formattedDate: string;

  formattedDate = todayDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  if (req.method === "GET") {
    try {
      const posts = await prisma.compareAT.findMany({
        where: {
          createdAt: {
            equals: formattedDate,
          },
          grade: {
            equals: req.query.grade,
          },
        },
      });

      res.status(200).json(posts);
    } catch (error) {
      if (error.code === "P2002") {
        // Handle duplicate record error
        res.status(400).json({ error: "Duplicate record found" });
      } else if (error.code === "P2025") {
        // Handle missing required field error
        res.status(400).json({ error: "Missing required field" });
      } else {
        // Handle unknown error
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
  if (req.method === "POST") {
    const dblength = await prisma.compareAT.findMany({
      where: {
        grade: req.body.grade,
      },
    });
    if (dblength.length == 1) {
      const data = req.body.firstcommitstudent;
      const text = JSON.stringify(data); // JSON 문자열로 변환

      const patch = await prisma.compareAT.updateMany({
        where: {
          grade: req.body.grade,
        },
        data: {
          data: text, // 변환된 JSON 문자열을 저장
          createdAt: formattedDate,
        },
      });

      res.status(200).json({ patch });
    } else if (dblength.length == 0) {
      try {
        const data = req.body.firstcommitstudent;
        const text = JSON.stringify(data); // JSON 문자열로 변환

        const post = await prisma.compareAT.create({
          data: {
            data: text,
            grade: req.body.grade,
            createdAt: formattedDate,
          },
        });

        res.status(200).json({ post });
      } catch (error) {
        if (error.code === "P2002") {
          // Handle duplicate record error
          res.status(400).json({ error: "Duplicate record found" });
        } else if (error.code === "P2025") {
          // Handle missing required field error
          res.status(400).json({ error: "Missing required field" });
        } else {
          // Handle unknown error
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } finally {
        await prisma.$disconnect();
      }
    } else if (dblength.length !== 1 && dblength.length !== 0) {
      try {
        const data = req.body.firstcommitstudent;
        const text = JSON.stringify(data); // JSON 문자열로 변환
        const patch = await prisma.compareAT.deleteMany({
          where: {
            grade: req.body.grade,
          },
        });

        const post = await prisma.compareAT.create({
          data: {
            data: text,
            createdAt: formattedDate,
            grade: req.body.grade,
          },
        });

        res.status(200).json({ post });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        await prisma.$disconnect();
      }
    }
  }
}
