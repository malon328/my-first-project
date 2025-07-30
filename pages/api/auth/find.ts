import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const search = req.query.search?.toString().toLowerCase() || "";
  const category = req.query.category?.toString().toLowerCase() || "";

  try {
    const posts = await prisma.article.findMany({
      where: {
        AND: [
          {
            OR: [
              { titel: { contains: search } },
              { body: { contains: search } },
            ],
          },
          category
            ? {
                category: {
                  name: {
                    equals: category,
                    
                  },
                },
              }
            : {},
        ],
      },
      include: {
        category: true,
        tags: true,
        author: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
