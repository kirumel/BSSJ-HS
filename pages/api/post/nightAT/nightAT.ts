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
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
