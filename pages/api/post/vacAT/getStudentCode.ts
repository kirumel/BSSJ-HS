import { prisma } from "../../prisma/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const studentNumber = parseInt(req.query.studentnumber, 10);
    console.log(studentNumber);
    const parseStudentNumber = function (studentNumber: any) {
      const strNum = studentNumber.toString().padStart(4, "0"); // 4자리 유지
      return {
        grade: parseInt(strNum[0], 10), // 첫 번째 숫자 = 학년
        class: parseInt(strNum[1], 10), // 두 번째 숫자 = 반
        number: parseInt(strNum.slice(2), 10), // 마지막 두 자리 = 번호
      };
    };
    const {
      grade,
      class: classNum,
      number,
    } = parseStudentNumber(studentNumber);
    console.log(grade, classNum, number);

    const { studentnumber } = req.query;
    if (!studentnumber) {
      return res.status(400).json({ message: "학번이 필요합니다." });
    }
    try {
      const record = await prisma.vacATSupervisor.findFirst({
        where: { studentnumber: number, class: classNum, grade: grade },
      });
      if (!record) {
        return res.status(203).json({ message: "등록된 학번이 없습니다." });
      }
      console.log(record);
      return res.status(200).json({ code: record });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "허용되지 않는 메소드입니다." });
  }
}
