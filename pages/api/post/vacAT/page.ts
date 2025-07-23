import { prisma } from "../../prisma/lib/prisma";
export default async function handler(req: any, res: any) {
  const todayDate = new Date();
  const startOfDay = new Date(todayDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(todayDate.setHours(23, 59, 59, 999));
  if (req.method === "GET") {
    try {
      const findDB = await prisma.vacATObject.findMany({});
      res.status(200).json(findDB);
    } catch (error) {
      res.status(400).json({ message: `오류발생${error} ` });
    }
  }
  //감독관 학생 등록
  if (req.method === "POST") {
    const todayDate = new Date();
    const formattedDate = todayDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const compareATdata = await prisma.vacCompareAT.findMany({
      where: {
        createdAt: {
          equals: formattedDate,
        },
        grade: {
          equals: req.body.grade.toString(),
        },
      },
    });

    if (compareATdata.length === 0 || !compareATdata[0]?.data) {
      await Promise.all(
        req.body.firstcommitstudent.map(async (a: any) => {
          const { id, comment, check, author, outTimeT } = a;
          const updateAttendance = await prisma.vacATObject.update({
            where: {
              id: id,
            },
            data: {
              outTimeT: outTimeT,
              comment,
              check,
              author,
              updatedAt: formattedDate,
            },
          });

          return updateAttendance;
        })
      );

      res.status(200).json({ message: "Attendance updated" });
    } else {
      const parsedata = JSON.parse(compareATdata[0].data as string);

      if (parsedata.length > 0 && parsedata[0].updatedAt === formattedDate) {
        res.status(202).json("2차 출석이 완료된 상태입니다");
      } else {
        await Promise.all(
          req.body.firstcommitstudent.map(async (a: any) => {
            const { id, comment, check, author, outTimeT } = a;
            const updateAttendance = await prisma.vacATObject.update({
              where: {
                id: id,
              },
              data: {
                outTimeT: outTimeT,
                comment,
                check,
                author,
                updatedAt: formattedDate,
              },
            });

            return updateAttendance;
          })
        );

        res.status(200).json({ message: "Attendance updated" });
      }
    }
    res.status(200).json({ message: "성공" });
  } else if (req.method === "PATCH") {
    const studentNumber = parseInt(req.body.studentnumber, 10);
    const dateObj = new Date(); // 문자열을 Date 객체로 변환
    const formattedDate = dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    try {
      // 학번을 학년, 반, 번호로 변환하는 함수
      const parseStudentNumber = function (studentNumber: any) {
        const strNum = studentNumber.toString().padStart(4, "0"); // 4자리 유지
        return {
          grade: parseInt(strNum[0], 10), // 첫 번째 숫자 = 학년
          class: parseInt(strNum[1], 10), // 두 번째 숫자 = 반
          number: parseInt(strNum.slice(2), 10), // 마지막 두 자리 = 번호
        };
      };
      const studentNumber = parseInt(req.body.studentnumber, 10);
      const {
        grade,
        class: classNum,
        number,
      } = parseStudentNumber(studentNumber);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const findDB = await prisma.vacATSupervisor.findMany({
        where: {
          studentnumber: number,
          check: "1",
          class: classNum,
          grade: grade,
          createdAt: {
            equals: formattedDate,
          },
        },
      });

      if (findDB.length !== 0) {
        if (findDB.some((a) => a.outTime)) {
          res.status(202).json({ message: "이미 퇴실 완료된 학생입니다" });
        } else {
          console.log(req.body);

          const updateDB = await prisma.vacATSupervisor.updateMany({
            where: {
              createdAt: {
                equals: formattedDate,
              },
              studentnumber: number,
              class: classNum,
              grade: grade,
            },
            data: {
              outTime: req.body.outTime,
            },
          });

          if (updateDB.count > 0) {
            // 변경된 행 수 확인
            res.status(200).json({
              message: `${findDB[0].name} 학생 퇴실 완료되었습니다 ${req.body.outTime}`,
            });
          } else {
            res.status(500).json({ message: "오류가 발생하였습니다." });
          }
        }
      } else {
        res.status(202).json({ message: "야자 미참여 학생입니다" });
      }
    } catch (error) {
      res.status(200).json({ message: `오류발생${error} ` });
    }
  }
}
