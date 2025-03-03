import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  const { studentIds } = req.body; // 요청 본문에서 studentIds를 받습니다.
  console.log(req.body);

  // studentIds가 없으면 400 에러를 반환
  if (!studentIds || studentIds.length === 0) {
    return res.status(400).send("학생 정보가 없습니다");
  }

  try {
    // studentIds가 배열이면, deleteMany에 in 조건을 사용하여 여러 ID를 삭제
    await prisma.mainAttendanceObject.deleteMany({
      where: {
        id: {
          in: studentIds, // studentIds 배열에 포함된 ID들 삭제
        },
      },
    });

    res.status(200).send("선택된 학생들 삭제 완료");
  } catch (error) {
    console.error(error);
    res.status(500).send("삭제 실패");
  }
}
