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
  if (/ChatGPT-User/i.test(ua)) return "ChatGPT-User";
  if (/OAI-SearchBot/i.test(ua)) return "OAI-SearchBot";
  if (/ClaudeBot/i.test(ua)) return "ClaudeBot";
  if (/Claude-Web/i.test(ua)) return "Claude-Web";
  if (/anthropic-ai/i.test(ua)) return "AnthropicBot";
  if (/PerplexityBot/i.test(ua)) return "PerplexityBot";
  if (/Googlebot/i.test(ua)) return "Googlebot";
  if (/GoogleOther/i.test(ua)) return "GoogleOther";
  if (/Google-InspectionTool/i.test(ua)) return "Google-InspectionTool";
  if (/AdsBot-Google/i.test(ua)) return "AdsBot-Google";
  if (/Googlebot-Image/i.test(ua)) return "Googlebot-Image";
  if (/Bingbot/i.test(ua)) return "Bingbot";
  if (/DuckDuckBot/i.test(ua)) return "DuckDuckBot";
  if (/YandexBot/i.test(ua)) return "YandexBot";
  if (/Bytespider/i.test(ua)) return "Bytespider";
  if (/CCBot/i.test(ua)) return "CCBot";
  if (/DataForSeoBot/i.test(ua)) return "DataForSeoBot";
  if (/SemrushBot/i.test(ua)) return "SemrushBot";
  if (/AhrefsBot/i.test(ua)) return "AhrefsBot";
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

    async function hashIp(ip: string): Promise<string> {
  const salt = process.env.LOG_SALT || "default_salt";
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

    const { error } = await supabase.from("access_logs").insert({
      ip_hash: await hashIp(ip),
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
