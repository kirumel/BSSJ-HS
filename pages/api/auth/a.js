import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const deleteSessionTemporarily = async (sessionToken) => {
  try {
    await prisma.session.deleteMany({
      where: { sessionToken },
    });
    console.log(`Session with token ${sessionToken} has been deleted.`);
  } catch (error) {
    console.error("Error deleting session:", error.message);
  }
};
