import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const { type2, subject, subSubject, grade, query } = req.query;
    console.log(type2, subject, subSubject, grade, query);

    try {
      const posts = await prisma.post.findMany({
        where: {
          type: "feed",
          ...(type2 ? { type2: { has: type2 } } : {}),
          ...(subject ? { subjectTags: { has: subject } } : {}),
          ...(subSubject ? { subSubjectTags: subSubject } : {}),
          ...(grade ? { gradeTags: { has: grade } } : {}),
          ...(query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { content: { contains: query, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: {
          comments: true,
          likes: true,
          author: true,
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `${error.message}` });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
