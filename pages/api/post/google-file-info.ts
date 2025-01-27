// /pages/api/drive-folder-info.js
import { google } from "googleapis";

const bytesToGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

export default async function handler(req: any, res: any) {
  const { folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ error: "No folder ID provided" });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "sjhs-helper-a8602e21146f.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const authClient = await auth.getClient();
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    // 폴더 안의 파일 목록 조회
    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents`,
      pageSize: 10,
      fields:
        "nextPageToken, files(id, name, thumbnailLink, webViewLink, mimeType)",
    });

    const files = filesResponse.data.files;

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching folder data:", error);
    res.status(500).json({ error: "Error fetching folder data" });
  } finally {
    await prisma.$disconnect();
  }
}
