
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const tagNames = req.query.tags; 

  const tagArray = typeof tagNames === "string" ? tagNames.split(",") : [];

  if (tagArray.length === 0) {
  return res.status(400).json({ error: "No tags provided in query" });
}

  try {
    const posts = await prisma.article.findMany({
      where: {
        tags: {
          some: {
            name: { in: tagArray }
          }
        }
      },
      include: {
        tags: true,
        category: true,
      }
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
