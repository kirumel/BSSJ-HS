import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

// Prisma 클라이언트 인스턴스 생성
const prisma = new PrismaClient();

// 학생 번호에서 번호만 추출하는 함수
const extractStudentNumber = (studentnumber: string) => {
  // 2자리 번호 처리 (예: 01, 02, ... -> 1, 2)
  if (studentnumber.length === 2) {
    return studentnumber.startsWith("0")
      ? studentnumber.slice(1)
      : studentnumber; // 앞의 0을 제거
  }

  // 4자리 이상의 번호에서 마지막 두 자리를 추출 (예: 2313 -> 13, 20313 -> 13)
  if (studentnumber.length >= 4) {
    return studentnumber.slice(-2); // 마지막 두 자리를 추출
  }

  return studentnumber; // 예외 처리 (그 외에는 그대로 반환)
};

// 엑셀 파일 읽기
const readExcelAndSaveToDatabase = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0]; // 첫 번째 시트 선택

  // 첫 번째 행을 헤더로 사용
  const headerRow = worksheet.getRow(1);

  // 헤더에서 각 컬럼 이름을 찾기 (이름, 반, 학년, 번호 열을 찾아서 인덱스를 기록)
  const headers = headerRow.values as string[];

  const nameIndex = headers.indexOf("이름");
  const classIndex = headers.indexOf("반");
  const gradeIndex = headers.indexOf("학년");
  const studentNumberIndex = headers.indexOf("번호");

  // 헤더가 존재하지 않으면 종료
  if (
    nameIndex === -1 ||
    classIndex === -1 ||
    gradeIndex === -1 ||
    studentNumberIndex === -1
  ) {
    console.error("필수 열이 엑셀 파일에 존재하지 않습니다.");
    return;
  }

  // 엑셀 데이터에서 행들을 읽고, 필요한 정보를 추출
  const filteredData: any = [];
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // 첫 번째 행은 헤더이므로 건너뜁니다.

    const name = row.getCell(nameIndex + 1).value; // 이름 열
    const className = row.getCell(classIndex + 1).value; // 반 열
    const grade = row.getCell(gradeIndex + 1).value; // 학년 열
    const studentNumber = row.getCell(studentNumberIndex + 1).value; // 번호 열

    // 번호가 없으면 건너뜁니다.
    if (!name || !className || !grade || !studentNumber) return;

    // 학생 번호 처리
    const studentNumberProcessed = extractStudentNumber(
      studentNumber.toString()
    );

    // 필터링된 데이터 배열에 추가
    filteredData.push({
      name,
      class: className,
      grade,
      studentnumber: studentNumberProcessed,
    });
  });

  // 데이터베이스에 저장
  for (const student of filteredData) {
    await prisma.attendanceObject.create({
      data: {
        name: student.name,
        class: student.class,
        grade: student.grade,
        studentnumber: student.studentnumber,
      },
    });
  }

  console.log("학생 정보가 데이터베이스에 성공적으로 등록되었습니다!");
};

// 파일 경로 지정
const filePath = "학생정보.xlsx";
readExcelAndSaveToDatabase(filePath).catch(console.error);
