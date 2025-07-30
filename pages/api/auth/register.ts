import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log("Checking if user exists with email:", email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
