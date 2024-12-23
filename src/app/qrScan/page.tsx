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
  const [ispresent, setispresent] = useState(false);
  const qrArray = ["Sj1", "Sj2", "Sj3", "Sj4"];
  const qrArray2 = ["Sj5", "Sj6", "Sj7"];

  const session = useSession();

  useEffect(() => {
    if (session.data?.user?.id) {
      try {
        axios
          .get("/api/scanQR2", { params: { nameid: session.data.user.id } })
          .then((res) => {
            if (res.status === 200) {
              if (res.data.length > 0) {
                setispresent(true);
              }
            } else {
              handleScanError(res.data.message);
            }
          });

        axios
          .get("/api/scanQR", { params: { nameid: session.data.user.id } })
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
  }, [session.data?.user?.id]);

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
      {!ispresent ? (
        <>
          {modal && <Hint closeModal={() => setmodal(false)} />}
          {modal2 && <Present closeModal={() => setmodal2(false)} />}
          {modal3 && <ShowPresent closeModal={() => setmodal3(false)} />}
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
            <p
              className="subtitle"
              style={{ fontSize: "10px", marginTop: "0px" }}
            >
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
                  onClick={() => setmodal3(true)}
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
                  onClick={() => setmodal2(true)}
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
            {stemp.find((item: any) => item.qrcode === "DB98-32905B-00") && (
              <div className="stemp-box">
                <div style={{ backgroundColor: "#A9F5BC" }}>히든</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {modal && <Hint closeModal={() => setmodal(false)} />}
          {modal2 && <Present closeModal={() => setmodal2(false)} />}
          {modal3 && <ShowPresent closeModal={() => setmodal3(false)} />}
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
            <p
              className="subtitle"
              style={{ fontSize: "10px", marginTop: "0px" }}
            >
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
                  onClick={() => setmodal3(true)}
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
              ></div>
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
          <p>이미 상품을 받으셨습니다</p>
        </>
      )}
    </>
  );
}
