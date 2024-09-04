import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fontdata } from "../font";
import { logo } from "../logo";

import { PrismaClient } from "@prisma/client";

export default async function handler(req: any, res: any) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const students = req.body;

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
    const 가로 = ["일자", "이름", "출석 여부", "미출석 이유", "작성자"];
    const 세로: any[] = [];

    students.firstcommitstudent.forEach((student: any) => {
      // 날짜 포맷을 ISO 형식으로 변환
      const formattedDate = student.createdAt.replace(
        /(\d{4})\. (\d{2})\. (\d{2})/,
        "$1-$2-$3"
      );
      const studentsData = [
        formattedDate,
        student.name,
        student.check == "2" ? "0" : student.check == "0" ? "0" : "1",
        student.comment,
        student.author,
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
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).send({ message: "허용되지 않은 접근입니다" });
  }
}
