import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId, email) {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function authenticateToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({ error: "Access token required" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return response.status(403).json({ error: "Invalid or expired token" });
  }

  request.user = decoded;
  next();
}
