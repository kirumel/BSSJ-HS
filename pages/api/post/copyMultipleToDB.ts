import { prisma } from "../prisma/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  const { students, targetDB } = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).send("학생 데이터가 비어 있습니다.");
  }

  try {
    let model;
    let formattedStudents;

    switch (targetDB) {
      case "nightAttendanceObject":
        model = prisma.nightAttendanceObject;
        formattedStudents = students.map((student) => ({
          name: student.name,
          grade: student.grade,
          class: student.class,
          studentnumber: student.studentnumber,
          secondNumber: student.secondNumber,
          monTime: student.monTime,
          monChecked: student.monChecked,
          tueTime: student.tueTime,
          tueChecked: student.tueChecked,
          wedTime: student.wedTime,
          wedChecked: student.wedChecked,
          thuTime: student.thuTime,
          thuChecked: student.thuChecked,
          friTime: student.friTime,
          friChecked: student.friChecked,
          outTimeT: student.outTimeT,
          outTimeST: student.outTimeST,
        }));
        break;

      case "attendanceObject":
        model = prisma.attendanceObject;
        formattedStudents = students.map((student) => ({
          name: student.name,
          grade: student.grade,
          class: student.class,
          studentnumber: student.studentnumber,
          secondNumber: student.secondNumber,
          monTime: student.monTime,
          monChecked: student.monChecked,
          tueTime: student.tueTime,
          tueChecked: student.tueChecked,
          wedTime: student.wedTime,
          wedChecked: student.wedChecked,
          thuTime: student.thuTime,
          thuChecked: student.thuChecked,
          friTime: student.friTime,
          friChecked: student.friChecked,
          outTimeT: student.outTimeT,
          outTimeST: student.outTimeST,
        }));
        break;

      case "vacATObject":
        model = prisma.vacATObject;
        formattedStudents = students.map((student) => ({
          name: student.name,
          grade: student.grade,
          class: student.class,
          studentnumber: student.studentnumber,
          secondNumber: student.secondNumber,
          check: student.check,
          comment: student.comment,
          author: student.author,
        }));
        break;

      case "mainAttendanceObject":
        model = prisma.mainAttendanceObject;
        formattedStudents = students.map((student) => ({
          name: student.name,
          grade: student.grade,
          class: student.class,
          studentnumber: student.studentnumber,
          check: student.check,
          comment: student.comment,
          author: student.author,
        }));
        break;

      default:
        return res.status(400).send("잘못된 모델 이름입니다.");
    }

    // 기존 데이터 삭제
    await Promise.all(
      formattedStudents.map((student) =>
        model.deleteMany({
          where: {
            name: student.name,
            grade: student.grade,
            class: student.class,
            studentnumber: student.studentnumber,
          },
        })
      )
    );

    // 새로운 데이터 생성
    await model.createMany({
      data: formattedStudents,
    });

    res.status(200).send("선택된 학생들 복사 완료");
  } catch (error) {
    console.error("복사 실패:", error);
    res.status(500).send("복사 실패");
  }
}
