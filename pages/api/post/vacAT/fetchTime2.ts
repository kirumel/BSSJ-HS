import { auth } from "google-auth-library";
import { prisma } from "../../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  // req.body.firstcommitstudent가 배열인 경우, id 추출은 다른 방법을 사용해야 합니다.
  // 여기서는 nightAttendanceObject의 업데이트를 위해 별도로 id를 받아온다고 가정합니다.
  const { id } = req.body;
  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다" });
  }

  try {
    // nightAtSupervisor 테이블에서 오늘 날짜의 레코드 검색
    const findDB = await prisma.vacATSupervisor.findMany({
      where: { createdAt: formattedDate },
    });

    if (findDB.length === 0) {
      // 오늘 날짜의 레코드가 없으면 createMany로 한 번에 생성
      await prisma.vacATSupervisor.createMany({
        data: req.body.firstcommitstudent.map((a: any) => ({
          createdAt: formattedDate,
          check: a.check,
          author: a.author,
          grade: a.grade,
          outTimeST: a.outTimeST,
          outTimeT: a.outTimeT,
          name: a.name,
          studentnumber: a.studentnumber,
          class: a.class,
          comment: a.comment,
        })),
      });
    } else {
      // 레코드가 이미 있다면 각 항목을 개별적으로 업데이트
      await Promise.all(
        req.body.firstcommitstudent.map((a: any) => {
          return prisma.vacATSupervisor.updateMany({
            where: {
              createdAt: formattedDate,
              studentnumber: a.studentnumber,
              class: a.class,
            },
            data: {
              check: a.check,
              author: a.author,
              grade: a.grade,
              outTimeST: a.outTimeST,
              outTimeT: a.outTimeT,
              name: a.name,
              comment: a.comment,
            },
          });
        })
      );
    }

    // nightAttendanceObject 업데이트
    const move = await prisma.vacATObject.updateMany({
      where: { id: id },
      data: {
        outTimeT: null,
        author: null,
        outTimeST: null,
        check: null,
        comment: null,
        updatedAt: null,
      },
    });

    // nightCompareAT 테이블 처리
    const gradeStr = req.body.firstcommitstudent[0].grade.toString();
    const findcompare = await prisma.vacCompareAT.findMany({
      where: {
        grade: gradeStr,
        createdAt: formattedDate,
      },
    });

    if (findcompare.length === 0) {
      await prisma.vacCompareAT.create({
        data: {
          grade: gradeStr,
          data: JSON.stringify(req.body.firstcommitstudent),
          createdAt: formattedDate,
        },
      });
    } else {
      await prisma.vacCompareAT.updateMany({
        where: { grade: gradeStr },
        data: {
          data: JSON.stringify(req.body.firstcommitstudent),
          createdAt: formattedDate,
        },
      });
    }

    return res.status(200).json({ move });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
