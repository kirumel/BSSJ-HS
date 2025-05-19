// pages/api/exportAttendance.ts
import type { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from "exceljs";
import { prisma } from "../../prisma/lib/prisma";
import Holidays from "date-holidays";

// 1. 날짜 범위 생성
function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let cur = new Date(start);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// 2. 한글 날짜 포맷
function formatKoreanDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}. ${mm}. ${dd}.`;
}

// 3. 'HH:mm' → 분
function parseTimeToMinutes(timeStr: string | null): number {
  if (!timeStr || timeStr === "0") return 0;
  const m = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

// 4. 분 → 'HH:mm'
function formatMinutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const all = await prisma.nightCompareAT2.findMany();
    return res.status(200).json(all);
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { grade, startDate, endDate } = req.body;
    if (!grade || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "grade, startDate, endDate 필수" });
    }

    // 날짜 리스트
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateList = getDateRange(start, end);
    const formattedDates = dateList.map(formatKoreanDate);

    // 한국 공휴일 설정
    const hd = new Holidays("KR");

    // DB 조회
    const records = await prisma.nightCompareAT2.findMany({
      where: { grade, createdAt: { in: formattedDates } },
    });

    interface StudInfo {
      name: string;
      class: number;
      studentnumber: number;
    }
    type CheckMap = Record<string, "O" | "X">;
    const studentMap: Record<
      string,
      { info: StudInfo; checks: CheckMap; totalMins: number }
    > = {};

    records.forEach((rec) => {
      const arr: any[] = JSON.parse(rec.data);
      arr.forEach((item) => {
        const key = `${item.name}_${item.class}_${item.studentnumber}`;
        if (!studentMap[key]) {
          studentMap[key] = { info: item, checks: {}, totalMins: 0 };
        }
        studentMap[key].checks[rec.createdAt] = item.check === "1" ? "O" : "X";
        const baseline = 18 * 60 + 30;
        const outMins = parseTimeToMinutes(item.outTime);
        studentMap[key].totalMins += Math.max(outMins - baseline, 0);
      });
    });

    // 엑셀 생성
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("출석현황");
    sheet.addRow(["이름", "반", "번호", ...formattedDates, "총시간"]);
    const header = sheet.getRow(1);
    header.font = { bold: true };
    header.alignment = { horizontal: "center", vertical: "middle" };

    // 학생 행 추가 (정렬)
    Object.values(studentMap)
      .sort(
        (a, b) =>
          a.info.class - b.info.class ||
          a.info.studentnumber - b.info.studentnumber
      )
      .forEach(({ info, checks, totalMins }) => {
        const row = [info.name, info.class, info.studentnumber];
        formattedDates.forEach((date) =>
          row.push(date in checks ? checks[date] : "데이터 없음")
        );
        row.push(formatMinutesToTime(totalMins));
        sheet.addRow(row);
      });

    sheet.columns?.forEach((col) => {
      col.width = 12;
    });

    // 휴일(주말 및 공휴일) 채우기: hd.isHoliday 활용
    dateList.forEach((date, idx) => {
      const colIdx = 4 + idx;
      const isHoliday = hd.isHoliday(date);
      if (date.getDay() === 0 || date.getDay() === 6 || isHoliday) {
        const col = sheet.getColumn(colIdx);
        col.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "DDEEFF" },
          };
        });
      }
    });

    // 응답
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance_${startDate}_to_${endDate}.xlsx`
    );
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
