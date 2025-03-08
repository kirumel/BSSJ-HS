import { prisma } from "../prisma/lib/prisma";

export default function handler(req: any, res: any) {
  if (req.method == "GET") {
    try {
      const result = prisma.mainAttendanceObject.findMany({});
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error getting sessions" });
    }
  }
}
