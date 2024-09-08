import NextAuth from "next-auth";
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
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.SJHSUser?.findFirst({
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
          return user;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30일
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          grade: user.grade,
          class: user.class,
          nickname: user.nickname,
          handle: user.handle,
          id: user.id,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
