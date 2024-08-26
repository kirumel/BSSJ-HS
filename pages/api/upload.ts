import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { PassThrough } from "stream";
import { google, drive_v3 } from "googleapis";

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

  // Cloudinary 설정
  const cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: "df0snozix",
    api_key: "528231681834542",
    api_secret: "jenbg7eihBW6qS-iDfln35Z8whY",
  });

  try {
    const { files } = await parseForm(req);

    // 비디오 파일의 경로
    const videoFile = files.video[0] as any;
    const inputFile = videoFile.filepath;

    // Cloudinary에 비디오 파일 업로드
    const uploadResponse = await cloudinary.uploader.upload(inputFile, {
      resource_type: "video",
      folder: "uploads",
      transformation: [
        { width: 1920, height: null, crop: "scale" },
        { audio_codec: "none" },
      ],
    });

    // Cloudinary 업로드 후의 비디오 URL
    const videoUrl = uploadResponse.secure_url;

    // 비디오 파일을 다운로드하여 Google Drive에 업로드
    const downloadStream = (url: string) => {
      return axios({
        url,
        method: "GET",
        responseType: "stream",
      }).then((response) => response.data);
    };

    // Google Drive 업로드를 위한 설정
    const auth = new google.auth.GoogleAuth({
      keyFile: "sjhs-helper-a8602e21146f.json",
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const compressAndUpload = async () => {
      try {
        const videoStream = await downloadStream(videoUrl);

        const fileMetadata: drive_v3.Schema$File = {
          name: "video.mp4",
        };

        const media: drive_v3.Params$Resource$Files$Create = {
          media: {
            body: videoStream,
          },
        };

        const driveResponse = await drive.files.create({
          resource: fileMetadata,
          media: media.media,
          fields: "id",
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

        res
          .status(200)
          .json({ message: "비디오 업로드 및 처리 완료", videoUrl });
      } catch (error) {
        console.error("Error during upload or processing:", error);
        res.status(500).json({ error: "비디오 업로드 또는 처리 실패" });
      }
    };

    await compressAndUpload();
  } catch (error) {
    console.error("Error parsing form data:", error);
    res.status(500).json({ error: "폼 데이터 파싱 실패" });
  }
};

export default uploadHandler;
