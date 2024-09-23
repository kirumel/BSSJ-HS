import NextAuth from "next-auth";
import { randomUUID } from "crypto";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.SJHSUser.findFirst({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("해당 이메일로 등록된 계정이 없습니다.");
        }

        const pwcheck = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!pwcheck) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        const sessionToken = randomUUID();
        await prisma.session.create({
          data: {
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sessionToken,
          },
        });

        return { ...user, sessionToken };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = { ...user, sessionToken: user.sessionToken };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.user?.sessionToken) {
        const sessionExists = await prisma.session.findUnique({
          where: { sessionToken: token.user.sessionToken },
        });

        if (!sessionExists) {
          return { user: null }; // 세션이 삭제되었으면 null 반환
        }

        session.user = token.user;
      } else {
        return { user: null };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  events: {
    signOut: async ({ token }) => {
      if (token?.sessionToken) {
        await prisma.session.deleteMany({
          where: { sessionToken: token.sessionToken },
        });
      }
    },
  },
};

// Prisma disconnect를 프로세스 종료 시 처리
async function disconnectPrisma() {
  await prisma.$disconnect();
}

process.on("SIGINT", disconnectPrisma);
process.on("SIGTERM", disconnectPrisma);

export default NextAuth(authOptions);
