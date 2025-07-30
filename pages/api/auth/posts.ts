// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const posts = await prisma.article.findMany({
    where: { authorid: user.id },
    select: {
      id: true,
      titel: true,
      body: true,
    },
  });

  res.status(200).json({ posts });
}
