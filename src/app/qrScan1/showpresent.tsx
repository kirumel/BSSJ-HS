/* eslint-disable @next/next/no-img-element */
"use client";

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

  return (
    <>
      <div className="modal">
        <div className="modal-content" style={{ margin: "30px" }}>
          <span className="modal-close-button" onClick={closeModal}>
            &times;
          </span>
          <div style={{ textAlign: "center", marginTop: "0px" }}>
            <p className="hint-title">상품 목록</p>{" "}
            <p
              style={{ marginTop: "0px", fontSize: "12px" }}
              className="subtitle"
            >
              5개는 진짜 쉽습니다 <br />
              찾아보세요!
            </p>
            <p></p>
            <p>
              QR 3개 : 과자 1개 지급!
              <br />
              <br />
              QR 5개 : 과자 1개 젤리1개 롤렛1회 지급!
              <br />
              <br />
              QR 7개 : 과자 2개 젤리1개 롤렛2회 지급!
              <br />
              <br />
              <br />
              QR 5개 이상 + 히든 qr찾을 시 : <br />
              룰렛 1회를 히든 룰렛으로 변경
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
