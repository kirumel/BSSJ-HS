// Prisma 클라이언트는 서버 시작 시 한 번만 생성하여 재사용하는 것이 좋습니다.
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma/lib/prisma";
import { compare } from "bcrypt";

export default async function handler(req, res) {
  const { grade } = req.query;

  try {
    const todayDate = new Date();

    //날자 보기좋게
    let formattedDate: string;

    formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // createMany 메서드를 사용하여 학생들을 추가
    const newStudents = await prisma.nightAttendanceObjectDB.deleteMany({
      where: {
        createdAt: formattedDate,
        grade: grade,
      },
    });

    const delete1 = await prisma.nightCompareAT2.deleteMany({
      where: {
        createdAt: formattedDate,
      },
    });
    const delete2 = await prisma.nightCompareAT.deleteMany({
      where: {
        createdAt: formattedDate,
      },
    });
    console.log(delete2);

    res.status(200).send("선택된 학생들 복사 완료");
  } catch (error) {
    console.error(error);
    res.status(500).send("복사 실패");
  }
}
