"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./style.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import PresentModal from "./presentModal";
export default function Page() {
  const [stemp, setstemp] = useState([]);
  const [modal, setmodal] = useState(false);
  const qrArray = ["Sj1", "Sj2", "Sj3", "Sj4"];
  const qrArray2 = ["Sj5", "Sj6", "Sj7"];

  useEffect(() => {
    try {
      axios
        .get("/api/scanQR", { params: { nameid: session.data?.user?.id } })
        .then((res) => {
          if (res.status === 200) {
            setstemp(res.data);
          } else {
            handleScanError(res.data.message);
          }
        });
    } catch (e: any) {
      handleScanError(e.message);
    }
  }, []);

  const session = useSession();
  function handleScanError(a: any) {
    toast.error(a);
  }
  function handlesuccess(a: any) {
    toast.success(a);
  }

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
      {modal ? <PresentModal closeModal={() => setmodal(false)} /> : null}
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
          <div>
            <button
              onClick={() => setmodal(true)}
              className="qr-Button"
              style={{ marginRight: "10px", backgroundColor: "#F5BCA9" }}
            >
              힌트보기
            </button>
            <button
              className="qr-Button"
              style={{ backgroundColor: "#D8CEF6" }}
            >
              상품보기
            </button>
          </div>
          <div
            style={{
              marginTop: "5px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              className="qr-Button"
              style={{ backgroundColor: "#A9F5BC" }}
            >
              상품받기QR
            </button>
          </div>
        </div>
      </div>
      <div className="scanner">
        <Scanner
          allowMultiple={true}
          components={{ zoom: true }}
          onScan={(data) => {
            handleScan(data[0].rawValue);
          }}
        />
      </div>
      <div className="stemp">
        <div className="stemp-box">
          {qrArray.map((a, i) => (
            <div
              {...(stemp.find((item: any) => item.qrcode === a)
                ? { style: { backgroundColor: "#A9F5BC" } }
                : {})}
            >
              {a.toString().slice(2)}
            </div>
          ))}
        </div>
        <div className="stemp-box">
          {qrArray2.map((a, i) => (
            <div
              {...(stemp.find((item: any) => item.qrcode === a)
                ? { style: { backgroundColor: "#A9F5BC" } }
                : {})}
            >
              {a.toString().slice(2)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
