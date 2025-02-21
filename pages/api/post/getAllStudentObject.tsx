import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method == "GET") {
    try {
      const result = await prisma.mainAttendanceObject.findMany({});
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error getting sessions" });
    }
  }
}
