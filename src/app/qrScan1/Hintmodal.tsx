/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { hintArray } from "./hintArray";

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

  const img = hintArray;
  return (
    <>
      <div className="modal">
        <div className="modal-content" style={{ margin: "30px" }}>
          <span className="modal-close-button" onClick={closeModal}>
            &times;
          </span>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {img.map((image, index) =>
              index === currentHintIndex ? (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      className="dish-button"
                      onClick={beforeHint}
                      disabled={currentHintIndex === 0}
                    >
                      &lt;
                    </button>
                    <div>
                      <p className="hint-title">QR코드 힌트</p>
                      <p
                        style={{ marginTop: "0px", fontSize: "12px" }}
                        className="subtitle"
                      >
                        {image.subTitle}
                      </p>
                    </div>{" "}
                    <button
                      className="dish-button"
                      onClick={nextHint}
                      disabled={currentHintIndex === img.length - 1}
                    >
                      &gt;
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {image.img ? (
                      <img
                        key={index}
                        className="hint-image"
                        alt={`${index + 1}`}
                        src={`${image.img}`}
                        width={230}
                        height={230}
                      />
                    ) : (
                      <p>선착순 5명</p>
                    )}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
}
