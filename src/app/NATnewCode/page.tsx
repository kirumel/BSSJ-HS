"use client";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import "./style.css";
import { useSession } from "next-auth/react";

export default function Page() {
  const [userId, setUserId] = useState(uuidv4());
  const { data: session } = useSession();
  useEffect(() => {
    gsap.fromTo(
      ".card",
      { y: 1000, scale: 0, opacity: 0 },
      {
        backgroundImage:
          "linear-gradient(135deg, rgb(22, 22, 27), rgba(0, 0, 0, 0.84))",
        y: 0,
        scale: 0.8,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }
    );

    gsap.to(".card", {
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
    });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setUserId(uuidv4()); // Update UUID every 5 seconds
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="card-display">
        <div className="card">
          <div className="card-face">
            <div style={{ marginTop: "3rem", marginBottom: "0px" }}>
              <div className="qr">
                <QRCodeSVG
                  value={userId}
                  size={200}
                  fgColor="#F2F2F5"
                  bgColor="none"
                  style={{
                    borderRadius: "10px",
                    width: "50vw",
                    maxWidth: "200px",
                    maxHeight: "200px",
                    height: "50vw",
                  }}
                />
              </div>
            </div>
            <h2 style={{ marginTop: "30px", marginBottom: "0px" }}>
              {session?.user?.name}
            </h2>
            <p style={{ margin: 0 }}>
              {session?.user?.grade}학년 {session?.user?.class}반
            </p>
            <p
              style={{
                marginTop: "30px",
                fontSize: "12px",
                borderRadius: "10px",
              }}
            >
              5초마다 변경됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
