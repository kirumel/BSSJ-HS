import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({ message: "유효하지 않은 요청입니다." });
    }

    try {
      const unverifiedUser = await prisma.unverifiedUser.findUnique({
        where: { email: email as string },
      });

      if (
        !unverifiedUser ||
        unverifiedUser.token !== token ||
        new Date() > unverifiedUser.expires
      ) {
        return res.status(400).json({
          message: "이미 인증된 이메일이거나 유효기간이 만료된 링크입니다",
        });
      }

      // 이메일 중복 체크
      const existingUser = await prisma.sJHSUser.findUnique({
        where: { email: email as string },
      });

      if (existingUser) {
        return res.status(400).json({ message: "이미 등록된 이메일입니다." });
      }

      const { password, name, nickname } = unverifiedUser;

      const newUser = await prisma.sJHSUser.create({
        data: { email: email as string, password, name, nickname },
      });

      await prisma.unverifiedUser.delete({
        where: { email: email as string },
      });

      res.status(200).json({
        message: "이메일 인증 성공. 회원가입이 완료되었습니다.",
        user: newUser,
      });
    } catch (error) {
      console.error("이메일 인증 중 오류 발생:", error);
      res.status(500).json({ message: "이메일 인증 중 오류가 발생했습니다." });
    }
  } else {
    res.status(405).json({ message: "허용되지 않는 메서드입니다." });
  }
}
