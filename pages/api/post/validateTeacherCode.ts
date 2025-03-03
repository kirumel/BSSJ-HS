import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않는 메서드입니다." });
  }

  const { teacherCode } = req.body;

  if (!teacherCode) {
    return res.status(400).json({ message: "인증코드를 입력해주세요." });
  }

  try {
    // 교사 인증코드 검증 (DB에서 조회)
    const validTeacher = await prisma.etcData.findUnique({
      where: {
        id: "code",
      },
    });
    console.log(validTeacher);

    if (validTeacher?.inTime !== teacherCode) {
      return res.status(401).json({ message: "잘못된 교사 인증코드입니다." });
    }

    return res.status(200).json({ message: "인증 성공!" });
  } catch (error) {
    console.error("교사 인증코드 검증 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
