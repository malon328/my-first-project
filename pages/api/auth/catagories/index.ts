import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const categories = await prisma.category.findMany();
    return res.status(200).json({ categories });
  }

  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    try {
      const category = await prisma.category.create({
        data: { name },
      });

      return res.status(201).json({ category });
    } catch (error) {
      console.error("Create category error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
