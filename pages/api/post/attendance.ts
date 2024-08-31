import { PrismaClient } from "@prisma/client";
import { json } from "stream/consumers";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method == "GET") {
    try {
      const attendance = await prisma.attendanceObject.findMany();
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ error });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method == "POST") {
    try {
      const reqObject = req.body;

      reqObject.studentData.map(async (a: any, i: any) => {
        const { name, grade, clss, studentnumber } = a;
        const afterGrade = parseInt(grade, 10);
        const afterclass = parseInt(clss, 10);
        const afterstudentnumber = parseInt(studentnumber, 10);
        const createAttendance = await prisma.attendanceObject.create({
          data: {
            name,
            grade: afterGrade,
            class: afterclass,
            studentnumber: afterstudentnumber,
          },
        });

        res.status(200).json(createAttendance);
      });
    } catch (error) {
      res.status(500).json({ message: "ㄴㄴ" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "PATCH") {
    try {
      const compareATdata = await prisma.compareAT.findFirst();
      const parsedata = JSON.parse(compareATdata?.data || "[]");
      const todayDate = new Date();
      const today = new Date();

      // 날짜 보기 좋게 설정
      let formattedDate: string;

      formattedDate = todayDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      if (parsedata.length > 0 && parsedata[0].updatedAt == formattedDate) {
        res.status(202).json("2차 출석이 완료된 상태입니다");
      } else {
        req.body.firstcommitstudent.map(async (a: any, i: any) => {
          const { id, comment, check, author } = a;
          const updateAttendance = await prisma.attendanceObject.update({
            where: {
              id: id,
            },
            data: {
              comment,
              check,
              author,
            },
          });

          res.status(200).json(updateAttendance);
        });
      }
    } catch (error) {
      res.status(500).json({ message: "ㄴㄴ" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // 추가적인 HTTP 메서드 처리 로직을 여기에 추가할 수 있습니다.
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
