"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./style.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
export default function Page() {
  const session = useSession();
  function handleScanError(a: any) {
    toast.error(a);
  }
  function handlesuccess(a: any) {
    toast.success(a);
  }
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        console.log("카메라에 접근 성공", stream);
      })
      .catch((error) => {
        console.error("카메라 권한 거부", error);
        if (error.name === "NotAllowedError") {
          alert("브라우저 설정에서 카메라 권한을 다시 활성화해주세요.");
        }
      });
  }, []);
  function handleScan(data: any) {
    try {
      axios
        .post("/api/scanQR", { qr: data, nameid: session.data?.user?.id })
        .then((res) => {
          if (res.status === 200) {
            handlesuccess(res.data.message);
          } else {
            handleScanError(res.data.message);
          }
        });
    } catch (e: any) {
      handleScanError(e.message);
    }
  }
  return (
    <>
      <Scanner
        components={{ finder: true }}
        onScan={(data) => {
          handleScan(data[0].rawValue);
        }}
      />
    </>
  );
}
