import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ category });
  }

  if (req.method === "DELETE") {
    try {
      await prisma.category.delete({
        where: { id: Number(id) },
      });

      return res.status(204).end(); 
    } catch (error) {
      return res.status(500).json({ error: "Delete failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
