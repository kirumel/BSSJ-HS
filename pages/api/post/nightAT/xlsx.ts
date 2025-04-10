import ExcelJS from "exceljs";

import { prisma } from "../../prisma/lib/prisma";
import { ca } from "date-fns/locale";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const { grade, date } = req.body.payload;
      // 날짜 보기 좋게 설정          // ISO 형식의 문자열
      const dateObj = new Date(date); // 문자열을 Date 객체로 변환
      const formattedDate = dateObj.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const startOfDay = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate()
      );
      const endOfDay = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate() + 1
      );

      const dbcompare = await prisma.nightAttendanceObjectDB.findMany({
        where: {
          createdAt: {
            equals: formattedDate,
          },
          grade: grade.toString(),
          type: "pdf",
        },
      });

      const students = await prisma.nightAtSupervisor.findMany({
        where: {
          createdAt: {
            equals: formattedDate,
          },
          grade: grade,
        },
      });

      if (students.length === 0) {
        console.log("No data");
        return res.status(400).json({ message: "No data" });
      }

      const studentSort = students.sort((a, b) => {
        if (a.class !== b.class) {
          return a.class - b.class;
        }
        return parseInt(a.studentnumber) - parseInt(b.studentnumber);
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("출석부");

      // 헤더 셀 스타일 설정
      worksheet.mergeCells("A1:E1");
      const headerCell = worksheet.getCell("A1");

      headerCell.value = `부산 성지고등학교 야자 출석부`;
      headerCell.alignment = { vertical: "middle" };
      headerCell.font = { size: 16, color: { argb: "FFFFFF" }, bold: true };
      headerCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "262626" },
      };

      // 열 제목 추가 및 스타일 설정
      worksheet.addRow([
        "일자",
        "이름",
        "반",
        "번호",
        "출석 여부",
        "미출석 이유",
        "작성자",
        "설정된 퇴장시간",
        "실제 퇴장시간",
      ]);
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
      worksheet.getColumn(2).width = 15; // B열 (이름)
      worksheet.getColumn(3).width = 5; // C열 (출석 여부)
      worksheet.getColumn(4).width = 8; // D열 (미출석 이유)
      worksheet.getColumn(5).width = 5; // E열 (작성자)
      worksheet.getColumn(6).width = 25;
      worksheet.getColumn(7).width = 10;
      worksheet.getColumn(8).width = 10;
      worksheet.getColumn(9).width = 25; // F열 (설정된 퇴장시간)
      worksheet.getRow(1).height = 30;

      // 데이터를 엑셀 시트에 추가
      studentSort.forEach((student: any) => {
        const row = [
          formattedDate,
          student.name,
          student.class,
          student.studentnumber,
          student.check == "2" ? "X" : student.check == "0" ? "X" : "O",
          student.comment,
          student.author,
          student.outTimeST ? student.outTimeST : "21:00",
          student.outTime ? student.outTime : "등록되지 않았습니다",
        ];
        worksheet.addRow(row);
      });

      // 엑셀 파일을 버퍼로 작성
      const buffer = await workbook.xlsx.writeBuffer();

      // 버퍼를 base64로 인코딩
      const base64 = buffer.toString("base64");
      if (dbcompare.length == 0) {
        try {
          const upload = await prisma.nightAttendanceObjectDB.create({
            data: {
              author: students[0].author,
              grade: grade.toString(),
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
      } else if (dbcompare.length >= 2 || dbcompare.length == 1) {
        try {
          const dbdelete = await prisma.nightAttendanceObjectDB.deleteMany({
            where: {
              createdAt: {
                equals: formattedDate,
              },
              type: {
                equals: "excel",
              },
            },
          });

          const upload = await prisma.nightAttendanceObjectDB.create({
            data: {
              author: students[0].author,
              grade: grade.toString(),
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
        res.status(400).json({ message: "업로드 실패" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
