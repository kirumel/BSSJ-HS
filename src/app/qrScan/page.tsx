"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
export default function Page() {
  return (
    <>
      <div>
        <Scanner onScan={(data) => alert(data[0].rawValue)} />
      </div>
    </>
  );
}
