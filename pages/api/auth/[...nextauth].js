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
    jwt: async ({ token, user, account, profile }) => {
      if (account?.provider === "kakao") {
        const existingUser = await prisma.sJHSUser.findFirst({
          where: { providerId: account.providerAccountId },
        });

        const findUser = await prisma.sJHSUser.findFirst({
          where: {
            email: profile?.email,
          },
        });

        if (findUser) {
          if (!existingUser) {
            if (token?.id) {
              await prisma.sJHSUser.update({
                where: { id: token.id },
                data: {
                  providerId: account.providerAccountId,
                  name: profile?.nickname || "카카오 유저",
                },
              });

              token.providerId = account.providerAccountId;
              token.name = profile?.nickname || "카카오 유저";
            }
          }
        } else if (!findUser && !existingUser) {
          const newUser = await prisma.sJHSUser.create({
            data: {
              providerId: account.providerAccountId,
              email:
                profile?.kakao_account?.email ||
                `${account.providerAccountId}@kakao.com`,
              name: profile?.nickname || "카카오 유저",
              User: {
                create: {
                  email: profile?.kakao_account?.email,
                  name: profile?.kakao_account?.name,
                },
              },
            },
          });

          token.id = newUser.id;
        }
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

        session.user = token.user;
      }

      return session;
    },
  },
  redirect: async ({ url, baseUrl, token, account }) => {
    // 카카오 유저가 새로 생성되었을 경우 리디렉션
    if (token?.isNewUser && account?.provider === "kakao") {
      return "/welcome"; // 카카오 유저일 때만 리디렉션
    }

    // 크리덴셜 로그인일 때는 리디렉션을 하지 않음
    if (account?.provider === "credentials") {
      return baseUrl; // 크리덴셜 로그인 시 리디렉션을 하지 않음
    }

    return url; // 기본 URL을 리턴
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
