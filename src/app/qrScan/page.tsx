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
        // 카메라 스트림 사용 코드
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        closeButton={false}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "0px" }}>숨겨진 QR코드를 찾아라!</h3>
        <p className="subtitle" style={{ fontSize: "10px", marginTop: "0px" }}>
          힌트를 보고 메이커실에 숨겨진 qr코드를 찾아주세요!
        </p>
        <div>
          <button>힌트보기</button>
          <button>상품보기</button>
        </div>
      </div>
      <div className="scanner">
        <Scanner
          onScan={(data) => {
            handleScan(data[0].rawValue);
          }}
        />
      </div>
      <div className="stemp">
        <div className="stemp-box">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </div>
        <div className="stemp-box">
          <div>5</div>
          <div>6</div>
          <div>7</div>
        </div>
      </div>
    </>
  );
}
