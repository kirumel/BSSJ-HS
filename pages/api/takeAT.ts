import { prisma } from "./prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const todayDate = new Date();
    console.log(req.body);

    //날자 보기좋게
    let formattedDate: string;

    formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const [
      nightAttendance,
      compareATNight,
      compareATNight2,
      compareAT8,
      student1,
      student2,
      student3,
    ] = await Promise.all([
      prisma.nightAttendanceObjectDB.findMany({
        where: { createdAt: formattedDate },
      }),
      prisma.nightCompareAT.findMany({
        where: { createdAt: formattedDate },
      }),
      prisma.nightCompareAT2.findMany({
        where: { createdAt: formattedDate },
      }),
      prisma.compareAT.findMany({
        where: { createdAt: formattedDate },
      }),
      prisma.attendanceObjectDB.findMany({
        where: { createdAt: formattedDate },
      }),
      prisma.attendanceObjectDB2.findMany({
        where: { createdAt: formattedDate },
      }),
      prisma.attendanceObjectDB3.findMany({
        where: { createdAt: formattedDate },
      }),
    ]);
    console.log(compareATNight);

    // 파일 생성 여부 판단
    const fileStatus = {
      night: nightAttendance.filter((item) => item.grade === "1").length > 0,
      night2: nightAttendance.filter((item) => item.grade === "2").length > 0,
      night3: nightAttendance.filter((item) => item.grade === "3").length > 0,
      compareATNight:
        compareATNight.filter((item) => item.grade === "1").length > 0,
      compareATNight2:
        compareATNight.filter((item) => item.grade === "2").length > 0,
      compareATNight3:
        compareATNight.filter((item) => item.grade === "3").length > 0,
      compareATNight21:
        compareATNight2.filter((item) => item.grade === "1").length > 0,
      compareATNight22:
        compareATNight2.filter((item) => item.grade === "2").length > 0,
      compareATNight23:
        compareATNight2.filter((item) => item.grade === "3").length > 0,
      compareAT8:
        nightAttendance.filter((item) => item.grade === "1").length > 0,
      compareAT82: compareAT8.filter((item) => item.grade === "2").length > 0,
      compareAT83: compareAT8.filter((item) => item.grade === "3").length > 0,
      grade1: student1.length > 0,
      grade2: student2.length > 0,
      grade3: student3.length > 0,
    };

    res.status(200).json({ fileStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
