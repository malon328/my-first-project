import jwt from "jsonwebtoken";

export function verifyToken(token: string): { id: number; email: string } | null {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch (error) {
    return null;
  }
}
