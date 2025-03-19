import { Prisma } from "@prisma/client";
import { prisma } from "./prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const student1 = await prisma.attendanceObjectDB.findMany({});
      const student2 = await prisma.attendanceObjectDB2.findMany({});
      const student3 = await prisma.attendanceObjectDB3.findMany({});

      // 각 DB의 결과에 grade 필드 추가
      const getstudent1 = student1.map((record) => ({ ...record, grade: "1" }));
      const getstudent2 = student2.map((record) => ({ ...record, grade: "2" }));
      const getstudent3 = student3.map((record) => ({ ...record, grade: "3" }));

      const getReq = await prisma.nightAttendanceObjectDB.findMany({});

      res.status(200).json({
        night: getReq, // 야자 파일 리스트 (nightAttendanceObjectDB)
        eight: [...getstudent1, ...getstudent2, ...getstudent3], // 8교시 파일 리스트 (각각 grade 추가됨)
      });
    } catch (error) {
      res.status(400).send("error");
    }
  }
}
