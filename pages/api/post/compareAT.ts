import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const posts = await prisma.compareAT.findFirst();
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
    try {
      const data = req.body.firstcommitstudent;
      const text = JSON.stringify(data); // JSON 문자열로 변환

      const post = await prisma.compareAT.create({
        data: {
          data: text, // 변환된 JSON 문자열을 저장
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
    }
  }
}
