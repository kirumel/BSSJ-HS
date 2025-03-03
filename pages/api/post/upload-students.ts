import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../prisma/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { students } = req.body;

      if (!students || !Array.isArray(students)) {
        return res.status(400).json({ error: "Invalid students data" });
      }

      // 학생 데이터 저장
      const createdStudents = await prisma.mainAttendanceObject.createMany({
        data: students.map((student) => ({
          name: student.name,
          class: parseInt(student.class.toString().trim(), 10),
          grade: parseInt(student.grade.toString().trim(), 10),
          studentnumber: parseInt(student.studentnumber.toString().trim(), 10),
        })),
        skipDuplicates: true, // 중복 저장 방지
      });

      return res.status(200).json({
        message: "학생 데이터 저장 완료",
        count: createdStudents.count,
      });
    } catch (error) {
      console.error("학생 데이터 저장 오류:", error);
      return res.status(500).json({ error: "서버 오류 발생" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
