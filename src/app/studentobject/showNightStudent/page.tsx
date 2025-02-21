import axios from "axios";
import "../addStudentObject/style.css";
import { useEffect, useState } from "react";
import Loading from "@/app/loding/page";

export default function Page() {
  const [students, setStudents] = useState<any[]>([]); // 학생 데이터를 저장할 상태
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/post/getAllStudentObject");
        setStudents(response.data); // 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div
        className="attendance-container"
        style={{ height: "60vh", width: "100%" }}
      >
        {students.length === 0 ? (
          <p>등록된 학생 데이터가 없습니다.</p>
        ) : (
          students.map((data, index) => (
            <div key={index} className="attendance-student">
              <div className="admin-student-display">
                <div className="attendance-student-title" style={{ margin: 0 }}>
                  <p className="attendance-student-name">{data.name}</p>
                  <p
                    className="attendance-student-gradeandclass"
                    style={{ fontSize: "10px" }}
                  >
                    {data.grade}학년 {data.class}반
                  </p>
                </div>
                <div>
                  <p className="attendance-student-number">
                    {data.studentnumber}번
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
