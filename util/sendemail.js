import nodemailer from "nodemailer";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "mailersend",

  port: 587,
  host: process.env.EMAIL_SERVER_HOST,
  secure: false,
  requireTLS: true,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export default async function sendVerificationEmail(email, expires, token) {
  try {
    await transporter.sendMail({
      from: "Altisto <no-reply@altisto.me>",
      to: email,
      subject: "이메일 인증",
      html: `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100vh; background-color: #f5f5fa; background-size: cover">
      <div style="background-color: white; border-radius: 16px; padding: 30px; margin: 10%">
      <h3 style="margin-top: 0;" >이메일 인증 링크입니다 <br /> 본인이라면 <br />인증버튼을 클릭해주세요</h3>
      <p>이 링크는 ${expires}까지 유효합니다.</p>
      <div style="margin-top: 20px; "><a href="http://localhost:3000/verify-email?email=${email}&token=${token}" style="text-decoration: none;"><button style="border: none; background-color: rgb(113, 128, 172); color: white; padding: 10px; border-radius: 10px;">인증하기</button></a></div>
      <div style="display: flex; justify-content: right;"><img style="width: 80px;" src='https://i.imgur.com/H7y28o2.png'/></div></div></div>`,
    });
  } catch (error) {
    console.error("이메일 전송 중 오류 발생:", error);
  }
}
