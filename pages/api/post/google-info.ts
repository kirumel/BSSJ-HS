import { google } from "googleapis";

const bytesToGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "sjhs-helper-a8602e21146f.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const authClient = await auth.getClient();
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    // 저장 용량 정보 조회
    const storageResponse = await drive.about.get({
      fields: "storageQuota",
    });

    const { storageQuota } = storageResponse.data;
    const totalStorage = parseInt(storageQuota.limit, 10);
    const usedStorage = parseInt(storageQuota.usage, 10);
    const freeStorage = totalStorage - usedStorage;

    // 파일 목록 조회
    const filesResponse = await drive.files.list({
      pageSize: 10,
      fields:
        "nextPageToken, files(id, name, thumbnailLink, webViewLink, mimeType)",
    });

    const files = filesResponse.data.files;

    res.status(200).json({
      storage: {
        total: bytesToGB(totalStorage),
        used: bytesToGB(usedStorage),
        free: bytesToGB(freeStorage),
      },
      files: files,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  } finally {
    await prisma.$disconnect();
  }
}
