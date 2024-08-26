import { PrismaClient } from "@prisma/client";

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
  }

  if (req.method == "POST") {
    try {
      const reqObject = req.body;

      {
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
      }
    } catch (error) {
      res.status(500).json({ message: "ㄴㄴ" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "PATCH") {
    try {
      {
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
  }
}
