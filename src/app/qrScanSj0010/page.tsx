"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./style.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import Hint from "./Hintmodal";
import Present from "./present";
import ShowPresent from "./showpresent";
export default function Page() {
  const [stemp, setstemp] = useState([]);
  const [modal, setmodal] = useState(false);
  const [modal2, setmodal2] = useState(false);
  const [modal3, setmodal3] = useState(false);
  const qrArray = ["Sj1", "Sj2", "Sj3", "Sj4"];
  const qrArray2 = ["Sj5", "Sj6", "Sj7"];

  const session = useSession();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }
  if (!session) {
    return <p>로그인 상태가 아닙니다</p>;
  }
  function handleScanError(a: any) {
    toast.error(a);
  }
  function handlesuccess(a: any) {
    toast.success(a);
  }

  function handleScan(data: any) {
    try {
      axios
        .post("/api/scanQR2", { qr: data, nameid: session.data?.user?.id })
        .then((res) => {
          if (res.status === 200) {
            handlesuccess(res.data.message);
          } else {
            handleScanError(res.data.message);
          }
        });

      axios
        .get("/api/scanQR2", { params: { nameid: session.data?.user?.id } })
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
        <h3 style={{ marginBottom: "0px" }}>상품받기!</h3>
        <p className="subtitle" style={{ fontSize: "10px", marginTop: "0px" }}>
          상품받기!
        </p>
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
              key={i}
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
              key={i}
              {...(stemp.find((item: any) => item.qrcode === a)
                ? { style: { backgroundColor: "#A9F5BC" } }
                : {})}
            >
              {a.toString().slice(2)}
            </div>
          ))}
        </div>
        {stemp.find((item: any) => item.qrcode === "DB98-32905B-00") ? (
          <div className="stemp-box">
            <div
              {...(stemp.find((item: any) => item.qrcode === "DB98-32905B-00")
                ? { style: { backgroundColor: "#A9F5BC" } }
                : {})}
            >
              히든
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
