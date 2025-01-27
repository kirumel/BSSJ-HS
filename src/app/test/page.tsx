"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [storage, setStorage] = useState<{
    total: number;
    used: number;
    free: number;
  } | null>(null);
  const [files, setFiles] = useState<
    {
      id: string;
      webViewLink: string;
      name: string;
      thumbnailLink: string;
      mimeType: string;
    }[]
  >([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriveInfo = async () => {
      try {
        const response = await fetch("/api/post/google-info");
        const data = await response.json();
        setStorage(data.storage);
        setFiles(data.files);
      } catch (err) {
        setError("Error fetching data");
      }
    };

    fetchDriveInfo();
  }, []);

  useEffect(() => {
    const fetchFilesInFolder = async () => {
      if (currentFolderId) {
        try {
          const response = await fetch(
            `/api/post/google-file-info?folderId=${currentFolderId}`
          );
          const data = await response.json();
          setFiles(data.files);
        } catch (err) {
          setError("Error fetching folder data");
        }
      }
    };

    fetchFilesInFolder();
  }, [currentFolderId]);

  async function fetchDriveInfo() {
    try {
      const response = await fetch("/api/post/google-info");
      const data = await response.json();
      setStorage(data.storage);
      setFiles(data.files);
    } catch (err) {
      setError("Error fetching data");
    }
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleBackClick = async () => {
    fetchDriveInfo();
    setCurrentFolderId(null); // 상위 폴더로 돌아갈 때 현재 폴더 ID를 초기화
  };

  if (!storage) return <p>Loading...</p>;

  const folders = files.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder"
  );
  const otherFiles = files.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.folder"
  );

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Google Drive Storage Info</h1>
      <div>
        <p>Total Storage (GB): {storage.total}</p>
        <p>Used Storage (GB): {storage.used}</p>
      </div>
      <h2>Files:</h2>

      {currentFolderId && (
        <button onClick={handleBackClick} style={{ marginBottom: "10px" }}>
          Back to root
        </button>
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => handleFolderClick(folder.id)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "5px",
              textAlign: "center",
            }}
          >
            <img
              src="/folder.jpeg"
              alt="Folder"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <p>{folder.name} 폴더</p>
          </div>
        ))}

        {/* 일반 파일을 그 뒤에 렌더링 */}
        {otherFiles.map((file) => (
          <div key={file.id} style={{ margin: "5px", textAlign: "center" }}>
            <a
              href={file.webViewLink}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={`/api/image-proxy?url=${encodeURIComponent(
                  file.thumbnailLink
                )}`}
                alt={file.name}
                style={{
                  maxWidth: "130px",
                  maxHeight: "130px",
                  borderRadius: "8px",
                }}
              />
              <div>{file.name.replace(/\.[^/.]+$/, "")}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
