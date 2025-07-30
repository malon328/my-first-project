import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Schema } from "../../../schemas/schemas";
import { verifyToken } from "../../../utils/verifyToken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = Schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: result.error.format(),
    });
  }

  const { titel, body, categoryName, tagNames } = result.data;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    const authorid = decoded.id;

    const article = await prisma.article.create({
      data: {
        titel,
        body,
        authorid,
      //   category: {
      //     connectOrCreate: {
      //       where: { name: categoryName },
      //       create: { name: categoryName }
      //     }
      //   },
      //   tags: {
      //     connectOrCreate: tagNames.map(name => ({
      //       where: { name },
      //       create: { name }
      //     }))
      //   }
      // },
      // include: {
      //   category: true,
      //   tags: true
      }
    });

    res.status(201).json({
      message: "Article created with new category/tags",
      article,
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ error: "Server error" });
  }
}