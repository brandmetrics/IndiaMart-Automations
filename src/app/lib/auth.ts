import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export type AuthUser = {
  id: number;
  role: "admin" | "user";
};

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("token")?.value;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id?: number;
      role?: string;
    };

    if (!decoded.id || !decoded.role) {
      return null;
    }

    return {
      id: decoded.id,
      role: decoded.role === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

export function isAdmin(user: AuthUser | null) {
  return user?.role === "admin";
}
