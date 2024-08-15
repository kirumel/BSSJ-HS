"use client";
import { useState } from "react";

interface Attendance {
  name: string;
  content: string;
  check: string;
  author: string;
  grade: string;
  class: string;
  studentnumber: string;
}

export default function PlusStudentModal(props: any) {
  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <video
            style={{ padding: "1rem" }}
            src="/파.mp4"
            autoPlay
            muted
            width={80}
            height={80}
          ></video>

          <h5>
            저장이 <br />
            완료되었습니다
          </h5>
        </div>
      </div>
    </>
  );
}
