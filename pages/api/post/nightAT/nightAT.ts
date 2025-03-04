import { compare } from "bcrypt";

import { prisma } from "../../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method == "GET") {
    const attendance = await prisma.nightAttendanceObject.findMany();
    res.status(200).json(attendance);
  } else if (req.method == "POST") {
    const reqObject = req.body;

    await Promise.all(
      reqObject.studentData.map(async (a: any) => {
        const { name, grade, clss, studentnumber } = a;
        const afterGrade = parseInt(grade, 10);
        const afterclass = parseInt(clss, 10);
        const afterstudentnumber = parseInt(studentnumber, 10);

        const createAttendance = await prisma.nightAttendanceObject.create({
          data: {
            name,
            grade: afterGrade,
            class: afterclass,
            studentnumber: afterstudentnumber,
          },
        });

        return createAttendance;
      })
    );

    res.status(200).json({ message: "Attendance created" });
  } else if (req.method === "PATCH") {
    const todayDate = new Date();
    const formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const compareATdata = await prisma.nightCompareAT.findMany({
      where: {
        createdAt: {
          equals: formattedDate,
        },
        grade: {
          equals: req.body.grade.toString(),
        },
      },
    });

    if (compareATdata.length === 0 || !compareATdata[0]?.data) {
      await Promise.all(
        req.body.firstcommitstudent.map(async (a: any) => {
          const { id, comment, check, author } = a;
          const updateAttendance = await prisma.nightAttendanceObject.update({
            where: {
              id: id,
            },
            data: {
              comment,
              check,
              author,
            },
          });

          return updateAttendance;
        })
      );

      res.status(200).json({ message: "Attendance updated" });
    } else {
      const parsedata = JSON.parse(compareATdata[0].data as string);

      if (parsedata.length > 0 && parsedata[0].updatedAt === formattedDate) {
        res.status(202).json("2차 출석이 완료된 상태입니다");
      } else {
        await Promise.all(
          req.body.firstcommitstudent.map(async (a: any) => {
            const { id, comment, check, author } = a;
            const updateAttendance = await prisma.nightAttendanceObject.update({
              where: {
                id: id,
              },
              data: {
                comment,
                check,
                author,
              },
            });

            return updateAttendance;
          })
        );

        res.status(200).json({ message: "Attendance updated" });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
