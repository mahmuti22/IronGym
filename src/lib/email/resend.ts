import { Resend } from "resend";

/** Server-only. Never expose RESEND_API_KEY to the client. */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/** Comma-separated ADMIN_ORDER_EMAIL → trimmed, non-empty list. */
export function parseAdminOrderEmails(): string[] {
  return (
    process.env.ADMIN_ORDER_EMAIL?.split(",").map((email) => email.trim()) ??
    []
  ).filter(Boolean);
}

export function hasAdminOrderEmails(): boolean {
  return parseAdminOrderEmails().length > 0;
}

export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "IronGym <onboarding@resend.dev>"
  );
}

export function isResendConfigured(): boolean {
  return Boolean(getResendClient());
}

/** Base URL for admin links in emails (server-only). */
export function getSiteBaseUrl(): string {
  const explicit =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}
