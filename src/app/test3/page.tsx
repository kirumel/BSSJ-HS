"use client";
import { useState } from "react";

export default function Home() {
  const [video, setVideo] = useState(null);

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("video", video);

    const res = await fetch("/api/post/profileimg", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("업로드 성공");
    } else {
      alert("업로드 실패");
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
}
