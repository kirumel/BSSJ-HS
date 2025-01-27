import Link from "next/link";
import "./admin.css";
export default function AdminTap() {
  return (
    <div className="right-left-margin">
      <p className="admin-title">Admin tap</p>
      <div className="scroll-container">
        <div>
          <Link href="/test">
            <div className="admin-color-box">
              Google service
              <br />
              drive file
            </div>
          </Link>
        </div>
        <div>
          <Link href="/test3">
            <div className="admin-color-box">파일 업로드</div>
          </Link>
        </div>
        <div>
          <Link href="/attendanceDB">
            <div className="admin-color-box">출석부 다운로드</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
