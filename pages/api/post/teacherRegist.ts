import bcrypt from "bcrypt";
import { prisma } from "../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않는 메서드입니다." });
  }

  const { email, password, name, nickname, grade, clss, teacherCode } =
    req.body;

  if (
    !email ||
    !password ||
    !name ||
    !nickname ||
    !grade ||
    !clss ||
    !teacherCode
  ) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    // 교사 인증코드 검증 (DB에서 조회)
    const validTeacher = await prisma.etcData.findUnique({
      where: {
        id: "code",
      },
    });

    if (validTeacher?.inTime !== teacherCode) {
      return res.status(401).json({ message: "잘못된 교사 인증코드입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    const finduser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (finduser) {
      return res.status(400).json({ message: "이미 가입된 이메일 입니다" });
    }

    // 새로운 유저 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        grade: parseInt(grade, 10),
        class: parseInt(clss, 10),
        name,
        nickname,
        role: "SjAdMin",
      },
    });

    return res.status(200).json({ message: "성공!" });
  } catch (error) {
    console.error("회원 가입 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "회원 가입 중 오류가 발생했습니다." });
  }
}
