import ExcelJS from "exceljs";

import { PrismaClient } from "@prisma/client";

export default async function handler(req: any, res: any) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const students = req.body;

    // 엑셀 워크북 및 워크시트 생성
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("출석부");

    // 헤더 셀 스타일 설정
    worksheet.mergeCells("A1:E1");
    const headerCell = worksheet.getCell("A1");

    headerCell.value = `부산 성지고등학교 출석부`;
    headerCell.alignment = { vertical: "middle" };
    headerCell.font = { size: 16, color: { argb: "FFFFFF" }, bold: true };
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "262626" },
    };

    // 열 제목 추가 및 스타일 설정
    worksheet.addRow(["일자", "이름", "출석 여부", "미출석 이유", "작성자"]);
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "8A9CFF" },
      };
      cell.font = { color: { argb: "FFFFFF" } };
    });

    // 열 너비 설정
    worksheet.getColumn(1).width = 15; // A열 (일자)
    worksheet.getColumn(2).width = 20; // B열 (이름)
    worksheet.getColumn(3).width = 15; // C열 (출석 여부)
    worksheet.getColumn(4).width = 30; // D열 (미출석 이유)
    worksheet.getColumn(5).width = 20; // E열 (작성자)
    worksheet.getRow(1).height = 30;

    // 데이터를 엑셀 시트에 추가
    students.firstcommitstudent.forEach((student: any) => {
      const formattedDate = student.createdAt.replace(
        /(\d{4})\. (\d{2})\. (\d{2})/,
        "$1-$2-$3"
      );
      const row = [
        formattedDate,
        student.name,
        student.check == "2" ? "0" : student.check == "0" ? "0" : "1",
        student.comment,
        student.author,
      ];
      worksheet.addRow(row);
    });

    // 엑셀 파일을 버퍼로 작성
    const buffer = await workbook.xlsx.writeBuffer();

    // 버퍼를 base64로 인코딩
    const base64 = buffer.toString("base64");

    const todayDate = new Date();
    const today = new Date();

    // 날짜 보기 좋게 설정
    let formattedDate: string;

    formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    try {
      const upload = await prisma.attendanceObjectDB3.create({
        data: {
          author: students.firstcommitstudent[0].author,
          link: base64,
          type: "excel",
          createdAt: formattedDate,
        },
      });

      res.status(200).json({ message: "업로드가 완료되었습니다" });
    } catch (error) {
      res.status(500).send({
        message: `에러가 발생하였습니다 오류 코드를 확인해주세요 ${error}`,
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
