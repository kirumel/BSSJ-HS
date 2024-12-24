import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { email, password, name, nickname, grade, clss } = req.body;
    console.log(req.body);

    if (!email || !password || !name || !nickname || !grade || !clss) {
      return res.status(202).json({ message: "모든 필드를 입력해주세요" });
    }

    const generateToken = () => {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      return { token, expires };
    };

    const { token, expires } = generateToken();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.sJHSUser.create({
        data: {
          email,
          password: hashedPassword,
          grade: parseInt(grade, 10),
          class: parseInt(clss, 10),
          name,
          nickname,
        },
      });

      const finduser = await prisma.sJHSUser.findFirst({
        where: {
          email: email,
        },
      });

      if (finduser === null) {
        res.status(202).json({ message: "회원 가입 중 오류가 발생했습니다." });
      } else {
        await prisma.user.create({
          data: {
            id: finduser.id,
            email,
            grade: parseInt(grade, 10),
            class: parseInt(clss, 10),
            name,
            nickname,
          },
        });

        res.status(200).json({ message: "성공!" });
      }
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
