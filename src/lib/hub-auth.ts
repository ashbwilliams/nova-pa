import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const HUB_COOKIE = "nova_hub_session";
const SESSION_AGE_SECONDS = 60 * 60 * 12;

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

function getSessionSecret() {
  return process.env.NOVA_SESSION_SECRET;
}

function sign(payload: string) {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isHubAuthConfigured() {
  return Boolean(process.env.NOVA_HUB_PASSWORD && getSessionSecret());
}

export function verifyHubPassword(password: string) {
  const expected = process.env.NOVA_HUB_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

export async function createHubSession() {
  const payload = Buffer.from(
    JSON.stringify({ expiresAt: Date.now() + SESSION_AGE_SECONDS * 1000 }),
  ).toString("base64url");
  const signature = sign(payload);

  if (!signature) throw new Error("NOVA Hub session security is not configured.");

  const cookieStore = await cookies();
  cookieStore.set(HUB_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/hub",
    maxAge: SESSION_AGE_SECONDS,
    priority: "high",
  });
}

export async function clearHubSession() {
  const cookieStore = await cookies();
  cookieStore.delete(HUB_COOKIE);
}

export async function hasHubSession() {
  const token = (await cookies()).get(HUB_COOKIE)?.value;
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = sign(payload);
  if (!expected || !safeEqual(signature, expected)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      expiresAt?: number;
    };
    return typeof data.expiresAt === "number" && data.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function requireHubSession() {
  if (!(await hasHubSession())) {
    throw new Error("Unauthorized NOVA Hub action.");
  }
}
