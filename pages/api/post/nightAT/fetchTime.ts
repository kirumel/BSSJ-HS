import { prisma } from "../../prisma/lib/prisma";
export default async function handler(req: any, res: any) {
  if (req.method === "PATCH") {
    try {
      // Promise.all로 비동기 작업이 완료될 때까지 기다립니다.
      const result = await Promise.all(
        req.body.firstcommitstudent.map(async (a: any) => {
          const { id, outTimeT } = a;

          const PATCH = await prisma.nightAttendanceObject.updateMany({
            where: { id: { equals: id } },
            data: {
              outTimeAT: outTimeT,
            },
          });

          return PATCH; // Promise.all을 위한 반환값
        })
      );

      res.status(200).json(result); // 수정된 결과를 반환
    } catch (error) {
      res.status(400).json({ message: `오류발생: ${error.message}` });
    }
  } else {
    res.status(405).json({ message: "허용되지 않은 메서드입니다" });
  }
}
