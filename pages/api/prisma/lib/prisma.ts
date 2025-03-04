import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"], // 쿼리 로그 없이 경고 & 에러만 출
  });

// Prisma 연결이 종료되면 자동으로 재연결 시도
async function reconnectPrisma() {
  try {
    console.warn("⚠️ Prisma connection lost. Attempting to reconnect...");
    await prisma.$connect();
    console.log("🔄 Prisma reconnected successfully");
  } catch (error) {
    console.error("❌ Prisma reconnection failed:", error);
  }
}

// 프로세스가 종료될 때 Prisma 연결 종료 방지
process.on("beforeExit", async () => {
  await reconnectPrisma();
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
