import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import axios from "axios";
import { google, drive_v3 } from "googleapis";
import fs from "fs";
import path from "path";
import { promisify } from "util";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm();

  const parseForm = (
    req: NextApiRequest
  ): Promise<{ fields: any; files: any }> => {
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });
  };

  try {
    const { files } = await parseForm(req);

    // 프로필 이미지 파일의 경로
    const imageFile = files.image[0] as any;
    const inputFile = imageFile.filepath;

    // 이미지 압축
    const compressedFilePath = path.join("/tmp", "compressed-image.jpg");
    await sharp(inputFile)
      .resize(600, 600, { fit: "inside" }) // 작은 크기로 조정
      .toFormat("webp") // WebP 포맷으로 변환
      .webp({ quality: 75 }) // 품질 설정 (60-75 정도 추천)
      .toFile(compressedFilePath);

    // Google Drive에 업로드
    const auth = new google.auth.GoogleAuth({
      keyFile: "sjhs-helper-a8602e21146f.json",
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const compressAndUpload = async () => {
      try {
        // Google Drive 폴더 ID: "profileimg" 폴더의 ID를 지정
        const folderId = "1jjr5jdydVH7j1fD2VPxNUAWtRwgmrx8Q";

        const fileMetadata: drive_v3.Schema$File = {
          name: "profile-image.jpg",
          parents: [folderId],
        };

        const media: drive_v3.Params$Resource$Files$Create = {
          media: {
            body: fs.createReadStream(compressedFilePath),
          },
        };

        const driveResponse = await drive.files.create({
          resource: fileMetadata,
          media: media.media,
          fields: "id, webViewLink",
        });

        console.log("File Id:", driveResponse.data.id);

        await drive.permissions.create({
          fileId: driveResponse.data.id,
          requestBody: {
            role: "writer",
            type: "user",
            emailAddress: "dndl302010@gmail.com",
          },
        });

        // 모든 사용자에게 읽기 권한 부여
        await drive.permissions.create({
          fileId: driveResponse.data.id,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });

        // 업로드된 이미지 링크 반환
        res.status(200).json({
          message: "이미지 업로드 및 처리 완료",
          imageUrl: driveResponse.data.webViewLink,
        });
      } catch (error) {
        console.error("Error during upload or processing:", error);
        res.status(500).json({ error: "이미지 업로드 또는 처리 실패" });
      } finally {
        // 임시 파일 삭제
        await promisify(fs.unlink)(compressedFilePath);
      }
    };

    await compressAndUpload();
  } catch (error) {
    console.error("Error parsing form data:", error);
    res.status(500).json({ error: "폼 데이터 파싱 실패" });
  }
};

export default uploadHandler;
