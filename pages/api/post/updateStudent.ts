import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, monTime, tueTime, wedTime, thuTime, friTime } = body;

    if (!id) {
      return NextResponse.json(
        { error: "학생 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const updatedStudent = await prisma.nightAttendanceObject.update({
      where: { id },
      data: {
        monTime,
        tueTime,
        wedTime,
        thuTime,
        friTime,
      },
    });

    return NextResponse.json({
      message: "요일별 시간 수정 성공",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("요일별 시간 수정 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
