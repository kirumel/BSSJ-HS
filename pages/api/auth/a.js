import { prisma } from "../prisma/lib/prisma";
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
