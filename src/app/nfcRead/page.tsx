"use client";
import { useEffect, useState } from "react";
import {
  deviceSupportsNFC,
  requestAccessToNFC,
  readFromTag,
  nfcEvents,
} from "webnfc";

export default function NFCReader() {
  const [nfcData, setNfcData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceSupportsNFC()) {
      setError("이 디바이스는 NFC를 지원하지 않습니다.");
    }

    nfcEvents.on("TagDetected", (tag) => {
      setNfcData(tag);
    });
  }, []);

  const handleReadNFC = async () => {
    try {
      await requestAccessToNFC();
      const tag = await readFromTag();
      setNfcData(tag);
    } catch (err) {
      setError("NFC 태그를 읽는 중 오류 발생");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>NFC 태그 리더</h1>
      <button
        onClick={handleReadNFC}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          margin: "10px",
        }}
      >
        NFC 태그 스캔
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {nfcData && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p style={{ fontSize: "18px" }}>NFC 태그 데이터:</p>
          <pre
            style={{
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {JSON.stringify(nfcData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
