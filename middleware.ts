import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/api/",
];

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

export async function middleware(request: NextRequest) {
  console.log("[MW] hit:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  const shouldSkip = SKIP_PREFIXES.some((p) => pathname.startsWith(p));
  if (shouldSkip) return NextResponse.next();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ua = request.headers.get("user-agent") || "";
    const path = pathname + (request.nextUrl.search || "");
    const isHoneypot =
      pathname.includes("/hidden-trap/") || pathname.includes("/llm-internal/");
    const asn = request.headers.get("x-vercel-ip-as-number") || null;

    const { error } = await supabase.from("access_logs").insert({
      ip_hash: ip,
      ua: ua || null,
      path,
      bot_type: detectBot(ua),
      verification_level: 0,
      is_honeypot: isHoneypot,
      asn: asn || null,
    });

    if (error) {
      console.error("[GEO Lab] insert error:", error.message);
    }
  } catch (e) {
    console.error("[GEO Lab] middleware error:", e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
