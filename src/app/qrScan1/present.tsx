/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";

interface Attendance {
  name: string;
  content: string;
  check: string;
  author: string;
  grade: string;
  class: string;
  studentnumber: string;
}

export default function PlusStudentModal(props: { closeModal: () => void }) {
  const { closeModal } = props;
  const { data: session, status } = useSession();
  const router = useRouter();
  function handleCloseModal() {
    window.location.reload();
  }
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>로그인 상태가 아닙니다</p>;
  }
  const userId = session.user?.id || "미로그인 상태입니다";
  return (
    <>
      <div className="modal">
        <div className="modal-content" style={{ margin: "30px" }}>
          <div style={{ textAlign: "center", marginTop: "0px" }}>
            <p>{userId}</p>
            <div style={{ marginTop: "20px" }}>
              <QRCodeSVG value={userId} size={200} />
            </div>
          </div>
          <button className="ok-button" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
