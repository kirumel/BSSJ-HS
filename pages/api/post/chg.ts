import { prisma } from "../prisma/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "모든 필드를 입력해주세요" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { name, email },
        data: {
          password: hashedPassword,
        },
      });

      res.status(200).json({ message: "성공!" });
    } catch (error) {
      console.error("회원 가입 중 오류 발생:", error);
      res.status(500).json({ message: "회원 가입 중 오류가 발생했습니다." });
    }
  } else {
    res.status(405).json({ message: "허용되지 않는 메서드입니다." });
  }
}
