import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../../utils/verifyToken"; 

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string" || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid article ID" });
  }
  const articleId = Number(id);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const userId = decoded.id;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { authorid: true }
  });

  if (!article || article.authorid !== userId) {
    return res.status(403).json({ error: "You are not authorized to modify this article" });
  }

  switch (req.method) {
    case "PUT": {
      const { titel, body, categoryName, tagNames } = req.body;

      const updateData: any = {};
      if (titel) updateData.titel = titel;
      if (body) updateData.body = body;

      if (categoryName) {
        updateData.category = {
          connectOrCreate: {
            where: { name: categoryName },
            create: { name: categoryName },
          },
        };
      }

      if (Array.isArray(tagNames)) {
        updateData.tags = {
          set: [],
          connectOrCreate: tagNames.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        };
      }

      try {
        const updated = await prisma.article.update({
          where: { id: articleId },
          data: updateData,
          include: {
            category: true,
            tags: true,
          },
        });

        return res.status(200).json({ message: "Article updated", article: updated });
      } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Failed to update article" });
      }
    }

    case "DELETE": {
      try {
        await prisma.article.delete({
          where: { id: articleId },
        });

        return res.status(200).json({ message: "Article deleted successfully" });
      } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Failed to delete article" });
      }
    }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
