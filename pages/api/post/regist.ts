import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../../../util/sendemail";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { email, password, name, nickname, grade, clss } = req.body;

    if (!email || !password || !name || !nickname || !grade || !clss) {
      return res.status(400).json({ message: "모든 필드를 입력해주세요" });
    }

    const generateToken = () => {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      return { token, expires };
    };

    const { token, expires } = generateToken();

    try {
      await sendVerificationEmail(email, expires, token);

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.unverifiedUser.create({
        data: {
          email,
          password: hashedPassword,
          grade: parseInt(grade, 10),
          class: parseInt(clss, 10),
          name,
          nickname,
          token,
          expires,
        },
      });

      res.status(200).json({ message: "성공!" });
    } catch (error) {
      console.error("회원 가입 중 오류 발생:", error);
      res.status(500).json({ message: "회원 가입 중 오류가 발생했습니다." });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: "허용되지 않는 메서드입니다." });
  }
}
