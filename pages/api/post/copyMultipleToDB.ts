import { Prisma } from "@prisma/client";

// Prisma 클라이언트는 서버 시작 시 한 번만 생성하여 재사용하는 것이 좋습니다.
import { prisma } from "../prisma/lib/prisma";

export default async function handler(req, res) {
  const { students, targetDB } = req.body;

  console.log(req.body);

  try {
    // targetDB가 올바른 모델을 참조하는지 확인 후 동적으로 처리
    let model;
    switch (targetDB) {
      case "nightAttendanceObject":
        model =
          prisma.nightAttendanceObject as Prisma.nightAttendanceObjectDelegate;
        break;
      case "attendanceObject":
        model = prisma.attendanceObject as Prisma.attendanceObjectDelegate;
        break;
      case "mainAttendanceObject":
        model =
          prisma.mainAttendanceObject as Prisma.mainAttendanceObjectDelegate;
        break;
      default:
        return res.status(400).send("잘못된 모델 이름");
    }

    // students 데이터가 배열인지 확인하고, 비어있지 않으면 처리
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).send("학생 데이터가 비어 있습니다");
    }

    // 학생 데이터가 올바르게 포맷되었는지 확인
    const formattedStudents = students.map((student: any) => ({
      name: student.name,
      grade: student.grade,
      class: student.class,
      studentnumber: student.studentnumber,
    }));

    // createMany 메서드를 사용하여 학생들을 추가
    const newStudents = await model.createMany({
      data: formattedStudents,
    });

    res.status(200).send("선택된 학생들 복사 완료");
  } catch (error) {
    console.error(error);
    res.status(500).send("복사 실패");
  }
}
