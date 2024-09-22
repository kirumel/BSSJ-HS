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
        try {
          const user = await prisma.SJHSUser.findFirst({
            where: {
              OR: [{ email: credentials.email }],
            },
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
        } catch (error) {
          throw new Error(error.message);
        }
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
          // 세션이 DB에서 삭제되었으면 null로 설정하여 로그아웃 처리
          return { user: null }; // 또는 return null; 사용 가능
        }

        session.user = token.user;
      } else {
        // 세션 토큰이 없으면 로그아웃 처리
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

// 임시로 세션을 삭제하는 함수

export default NextAuth(authOptions);
