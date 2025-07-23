import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    try {
      const { id } = req.query;
      const { monTime, tueTime, wedTime, thuTime, friTime } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "유효하지 않은 ID" });
      }

      const updatedStudent = await prisma.vacATObject.update({
        where: { id },
        data: { monTime, tueTime, wedTime, thuTime, friTime },
      });

      return res.status(200).json({
        message: "수정 완료",
        student: updatedStudent,
      });
    } catch (err) {
      console.error("수정 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
  } else {
    return res.status(405).json({ error: "허용되지 않은 메서드" });
  }
}
