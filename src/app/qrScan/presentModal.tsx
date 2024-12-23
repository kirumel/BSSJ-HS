"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import sj1 from "./Sj1.jpg";

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
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);
  const nextHint = () => {
    setCurrentHintIndex(currentHintIndex + 1);
  };

  const beforeHint = () => {
    setCurrentHintIndex(currentHintIndex - 1);
  };
  const img = [sj1];

  return (
    <>
      <div className="modal">
        <div className="modal-content" style={{ margin: "30px" }}>
          <span className="modal-close-button" onClick={closeModal}>
            &times;
          </span>
          <button
            className="dish-button"
            onClick={beforeHint}
            disabled={currentHintIndex === 0}
          >
            &lt;
          </button>

          <button
            className="dish-button"
            onClick={nextHint}
            disabled={currentHintIndex === img.length - 1}
          >
            &gt;
          </button>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {img.map((image, index) =>
              index === currentHintIndex ? (
                <>
                  <div>
                    <p className="hint-title">QR코드 힌트</p>
                    <p
                      style={{ marginTop: "0px", fontSize: "12px" }}
                      className="subtitle"
                    >
                      등잔밑이 어둡다
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      key={index}
                      className="hint-image"
                      alt={`${index + 1}`}
                      src={image.src}
                      width={230}
                      height={230}
                    />
                  </div>
                </>
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
}
