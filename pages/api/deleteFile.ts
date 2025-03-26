// Prisma 클라이언트는 서버 시작 시 한 번만 생성하여 재사용하는 것이 좋습니다.
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma/lib/prisma";
import { compare } from "bcrypt";

export default async function handler(req, res) {
  const { targetDB } = req.query;

  try {
    // targetDB가 올바른 모델을 참조하는지 확인 후 동적으로 처리
    let model;
    switch (targetDB) {
      case "attendanceObjectDB":
        model = prisma.attendanceObjectDB as Prisma.attendanceObjectDBDelegate;
        break;
      case "attendanceObjectDB2":
        model =
          prisma.attendanceObjectDB2 as Prisma.attendanceObjectDB2Delegate;
        break;
      case "attendanceObjectDB3":
        model =
          prisma.attendanceObjectDB3 as Prisma.attendanceObjectDB3Delegate;
        break;
      default:
        return res.status(403).send("잘못된 모델 이름");
    }
    const todayDate = new Date();

    //날자 보기좋게
    let formattedDate: string;

    formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // createMany 메서드를 사용하여 학생들을 추가
    const newStudents = await model.deleteMany({
      where: {
        createdAt: formattedDate,
      },
    });
    const delete2 = await prisma.compareAT.deleteMany({
      where: {
        createdAt: formattedDate,
      },
    });
    console.log(delete2);

    res.status(200).send(delete2);
  } catch (error) {
    console.error(error);
    res.status(500).send("복사 실패");
  }
}
