import { Prisma, PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const { students, targetDB } = req.body;

  console.log(req.body);

  try {
    // targetDB가 정확한 모델을 참조하는지 확인 후 동적으로 처리
    let model;
    if (targetDB === "nightAttendanceObject") {
      model =
        prisma.nightAttendanceObject as Prisma.nightAttendanceObjectDelegate;
    } else if (targetDB === "attendanceObject") {
      model = prisma.attendanceObject as Prisma.attendanceObjectDelegate;
    } else {
      return res.status(400).send("잘못된 모델 이름");
    }

    // 모델에 맞게 createMany 호출
    const newStudents = await model.createMany({
      data: students.map((student: any) => ({
        name: student.name,
        grade: student.grade,
        class: student.class,
        studentnumber: student.studentnumber,
      })),
    });

    res.status(200).send("선택된 학생들 복사 완료");
  } catch (error) {
    console.error(error);
    res.status(500).send("복사 실패");
  } finally {
    await prisma.$disconnect();
  }
}
