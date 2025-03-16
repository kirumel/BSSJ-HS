import NextAuth from "next-auth";
import { randomUUID, sign } from "crypto";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { signOut } from "next-auth/react";

import { prisma } from "../prisma/lib/prisma";

export const authOptions = {
  debug: true, // ✅ 디버그 모드 ON
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
        const user = await prisma.user.findFirst({
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
    jwt: async ({ token, user, account, profile }) => {
      if (account?.provider === "kakao") {
        const providerAccountId = profile?.id.toString(); // ✅ 수정된 부분
        let userRecord;

        if (token.id) {
          // 기존 사용자 업데이트
          userRecord = await prisma.user.update({
            where: { id: token.id },
            data: {
              providerId: providerAccountId,
              name: profile?.nickname,
            },
          });
        } else {
          // 새로운 사용자 생성
          // 먼저 이메일로 유저가 존재하는지 확인
          userRecord = await prisma.user.findFirst({
            where: { email: profile?.kakao_account?.email },
          });

          if (!userRecord) {
            // 이메일이 없으면 새로운 유저를 생성
            userRecord = await prisma.user.create({
              data: {
                providerId: providerAccountId,
                email: profile?.kakao_account?.email,
                name: profile?.kakao_account?.nickname,
              },
            });
            token.isNewUser = true;
          } else {
            // 이메일이 이미 존재하는 경우, 그 유저 정보를 업데이트할 수 있음
            userRecord = await prisma.user.update({
              where: { email: profile?.kakao_account?.email },
              data: {
                providerId: providerAccountId,
                name: profile?.kakao_account?.nickname,
              },
            });
          }
        }
        token.id = userRecord.id;
        token.providerId = userRecord.providerId;
      }

      if (user) {
        token.user = {
          ...user,
          sessionToken: user?.sessionToken || token?.sessionToken,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token?.user?.sessionToken) {
        const sessionExists = await prisma.session.findUnique({
          where: { sessionToken: token.user.sessionToken },
        });

        if (!sessionExists) {
          return null; // 세션이 존재하지 않으면 null 반환
        }

        session.user.id = token.user.id;
        session.user.name = token.user.name;
        session.user.email = token.user.email;
        session.user.image = token.user.image;
        session.user.role = token.user.role;
        session.user.grade = token.user.grade;
        session.user.class = token.user.class;
        session.user.sessionToken = token.user.sessionToken;
        session.user.providerId = token.user.providerId;
        session.user.nickname = token.user.nickname;
        session.user.studentnumber = token.user.studentnumber;
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

export default NextAuth(authOptions);
