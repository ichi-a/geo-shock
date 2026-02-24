// 場所: src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/favicon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/api/",
];

// ========================================
// UAベースのボット判定
// ========================================
function detectBotByUA(ua: string): string | null {
  if (!ua) return "unknown";
  if (/GPTBot/i.test(ua)) return "GPTBot";
  if (/ChatGPT-User/i.test(ua)) return "ChatGPT-User";
  if (/OAI-SearchBot/i.test(ua)) return "OAI-SearchBot";
  if (/ClaudeBot/i.test(ua)) return "ClaudeBot";
  if (/Claude-Web/i.test(ua)) return "Claude-Web";
  if (/anthropic-ai/i.test(ua)) return "AnthropicBot";
  if (/PerplexityBot/i.test(ua)) return "PerplexityBot";
  if (/Googlebot-Image/i.test(ua)) return "Googlebot-Image";
  if (/Googlebot/i.test(ua)) return "Googlebot";
  if (/GoogleOther/i.test(ua)) return "GoogleOther";
  if (/Google-InspectionTool/i.test(ua)) return "Google-InspectionTool";
  if (/AdsBot-Google/i.test(ua)) return "AdsBot-Google";
  if (/Bingbot/i.test(ua)) return "Bingbot";
  if (/DuckDuckBot/i.test(ua)) return "DuckDuckBot";
  if (/YandexBot/i.test(ua)) return "YandexBot";
  if (/Bytespider/i.test(ua)) return "Bytespider";
  if (/CCBot/i.test(ua)) return "CCBot";
  if (/DataForSeoBot/i.test(ua)) return "DataForSeoBot";
  if (/SemrushBot/i.test(ua)) return "SemrushBot";
  if (/AhrefsBot/i.test(ua)) return "AhrefsBot";
  if (/MJ12bot/i.test(ua)) return "MJ12bot";
  if (/DotBot/i.test(ua)) return "DotBot";
  return null;
}

// ========================================
// ASNベースの補完判定
// UAで判定できなかった場合に使う
// ========================================
const ASN_MAP: Record<string, string> = {
  // Google
  "15169": "Google-Unverified",
  // Microsoft / Bing
  "8075": "Microsoft-Unverified",
  // Amazon / AWS
  "14618": "Amazon-Unverified",
  "16509": "Amazon-Unverified",
  // Cloudflare
  "13335": "Cloudflare",
  // DigitalOcean
  "14061": "DigitalOcean",
  // Hetzner
  "24940": "Hetzner",
  // M247（スクレイパー温床）
  "9009": "M247-Scraper",
  // OVH
  "16276": "OVH",
  // Linode
  "63949": "Linode",
  // Alibaba
  "45102": "Alibaba",
  // Tencent
  "132203": "Tencent-Cloud",
  // Hurricane Electric
  "6939": "HurricaneElectric",
};

function detectBotByASN(asn: string | null): string | null {
  if (!asn) return null;
  return ASN_MAP[asn] || null;
}

// ========================================
// IPハッシュ化（Edge Runtime対応）
// ========================================
async function hashIp(ip: string): Promise<string> {
  const salt = process.env.LOG_SALT || "default_salt";
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ========================================
// メイン
// ========================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const shouldSkip = SKIP_PREFIXES.some((p) => pathname.startsWith(p));
  if (shouldSkip) return NextResponse.next();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const ua = request.headers.get("user-agent") || "";
    const path = pathname + (request.nextUrl.search || "");
    const isHoneypot =
      pathname.includes("/hidden-trap/") || pathname.includes("/llm-internal/");
    const asn = request.headers.get("x-vercel-ip-as-number") || null;

    // UAで判定 → ダメならASNで補完
    const botByUA = detectBotByUA(ua);
    const botByASN = detectBotByASN(asn);
    const botType = botByUA || botByASN || null;

    // 検証レベル
    // L1: UAで判定できた
    // L0: ASN補完 or 不明
    const verificationLevel = botByUA ? 1 : 0;

    const { error } = await supabase.from("access_logs").insert({
      ip_hash: await hashIp(ip),
      ua: ua || null,
      path,
      bot_type: botType,
      verification_level: verificationLevel,
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
