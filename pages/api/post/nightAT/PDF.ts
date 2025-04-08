import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fontdata } from "../font";
import { logo } from "../logo";

import { prisma } from "../../prisma/lib/prisma";

export default async function handler(req: any, res: any) {
  const { grade, date } = req.body.payload;
  // 날짜 보기 좋게 설정          // ISO 형식의 문자열
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  console.log("fdsf", formattedDate);

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

  if (req.method === "POST") {
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
    const pdf = new jsPDF();

    // 폰트 추가 및 설정
    pdf.addFileToVFS("malgun.ttf", fontdata);
    pdf.addFont("malgun.ttf", "malgun", "normal");
    pdf.setFont("malgun");

    const imgWidth = (35 / 5) * 3;
    const imgHeight = (12 / 5) * 3;

    // 페이지의 너비 가져오기
    const pageWidth = pdf.internal.pageSize.getWidth();

    // 중앙에 배치하기 위한 X 좌표 계산
    const x = (pageWidth - imgWidth) / 2;

    // 이미지 추가
    pdf.addImage(logo, "PNG", 13, 13, imgWidth, imgHeight);

    // 테이블 헤더와 데이터
    const 가로 = [
      "일자",
      "이름",
      "반",
      "번호",
      "출석 여부",
      "미출석 이유",
      "작성자",
      "설정된 퇴장시간",
      "실제 퇴장시간",
    ];
    const 세로: any[] = [];

    students.forEach((student: any) => {
      const studentsData = [
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
      세로.push(studentsData);
    });

    // autoTable 호출 전에 폰트 설정 확인
    pdf.setFont("malgun");

    // 테이블 추가
    autoTable(pdf, {
      head: [가로],
      body: 세로,
      startY: 30,
      styles: {
        font: "malgun", // autoTable에서 폰트 설정
        fontSize: 12, // 폰트 크기 조절 (필요에 따라 조정)
      },
      headStyles: { fillColor: [138, 156, 255] },
    });

    // PDF 데이터 생성
    const pdfData = pdf.output("datauristring");
    if (dbcompare.length == 0) {
      try {
        const upload = await prisma.nightAttendanceObjectDB.create({
          data: {
            author: students[0].author,
            grade: grade.toString(),
            link: pdfData,
            type: "pdf",
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
              equals: "pdf",
            },
          },
        });

        const upload = await prisma.nightAttendanceObjectDB.create({
          data: {
            author: students[0].author,
            grade: grade.toString(),
            link: pdfData,
            type: "pdf",
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
      res.status(400).send({ message: "오류가 발생하였습니다" });
    }
  } else {
    res.status(405).send({ message: "허용되지 않은 접근입니다" });
  }
}
