import { NextRequest, NextResponse } from "next/server";

type TokenPayload = {
  id?: number;
  role?: string;
  exp?: number;
};

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlToJson<T>(value: string): T | null {
  try {
    const bytes = base64UrlToBytes(value);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const decodedHeader = base64UrlToJson<{ alg?: string }>(header);

  if (decodedHeader?.alg !== "HS256") {
    return null;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    new TextEncoder().encode(`${header}.${payload}`)
  );

  if (!isValid) {
    return null;
  }

  const decodedPayload = base64UrlToJson<TokenPayload>(payload);

  if (!decodedPayload?.id || !decodedPayload.role) {
    return null;
  }

  if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
    return null;
  }

  return decodedPayload;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyToken(token);

  if (!user) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/dashboard/users") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
