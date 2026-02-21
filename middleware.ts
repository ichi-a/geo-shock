import { NextRequest, NextResponse } from "next/server";

const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/api/",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const shouldSkip = SKIP_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (shouldSkip) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const ua = request.headers.get("user-agent") || "";
  const path = pathname + (request.nextUrl.search || "");
  const isHoneypot =
    pathname.includes("/hidden-trap/") || pathname.includes("/llm-internal/");
  const asn = request.headers.get("x-vercel-ip-as-number") || null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    try {
      await fetch(`${supabaseUrl}/rest/v1/access_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          ip_hash: ip,
          ua: ua || null,
          path,
          bot_type: detectBot(ua),
          verification_level: 0,
          is_honeypot: isHoneypot,
          asn: asn || null,
        }),
        signal: controller.signal,
      });
    } catch (e) {
      console.error("[GEO Lab] log error:", e);
    } finally {
      clearTimeout(timeout);
    }
  }

  return NextResponse.next();
}

function detectBot(ua: string): string | null {
  if (!ua) return "EmptyUA";
  if (/GPTBot/i.test(ua)) return "GPTBot";
  if (/ClaudeBot/i.test(ua)) return "ClaudeBot";
  if (/Google-Extended/i.test(ua)) return "Google-Extended";
  if (/Googlebot/i.test(ua)) return "Googlebot";
  if (/PerplexityBot/i.test(ua)) return "PerplexityBot";
  if (/Bingbot/i.test(ua)) return "Bingbot";
  if (/ChatGPT-User/i.test(ua)) return "ChatGPT-User";
  return null;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
