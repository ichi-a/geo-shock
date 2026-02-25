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
// UAベースのボット判定（完全版）
// ========================================
function detectBotByUA(ua: string): string | null {
  if (!ua) return null;

  // Anthropic
  if (/ClaudeBot/i.test(ua)) return "ClaudeBot";
  if (/Claude-Web/i.test(ua)) return "Claude-Web";
  if (/anthropic-ai/i.test(ua)) return "AnthropicBot";

  // OpenAI
  if (/GPTBot/i.test(ua)) return "GPTBot";
  if (/ChatGPT-User/i.test(ua)) return "ChatGPT-User";
  if (/OAI-SearchBot/i.test(ua)) return "OAI-SearchBot";

  // Google
  if (/Google-CloudVertexBot/i.test(ua)) return "Google-CloudVertexBot";
  if (/Google-Extended/i.test(ua)) return "Google-Extended";
  if (/Google-InspectionTool/i.test(ua)) return "Google-InspectionTool";
  if (/Googlebot-Image/i.test(ua)) return "Googlebot-Image";
  if (/AdsBot-Google/i.test(ua)) return "AdsBot-Google";
  if (/GoogleOther/i.test(ua)) return "GoogleOther";
  if (/Googlebot/i.test(ua)) return "Googlebot";
  if (/Bard/i.test(ua)) return "Bard";

  // Apple
  if (/Applebot-Extended/i.test(ua)) return "Applebot-Extended";
  if (/Applebot/i.test(ua)) return "Applebot";

  // Microsoft
  if (/Bingbot/i.test(ua)) return "Bingbot";

  // Perplexity
  if (/PerplexityBot/i.test(ua)) return "PerplexityBot";

  // Meta
  if (/Meta-ExternalAgent/i.test(ua)) return "Meta-ExternalAgent";
  if (/Meta-ExternalFetcher/i.test(ua)) return "Meta-ExternalFetcher";
  if (/FacebookBot/i.test(ua)) return "FacebookBot";

  // Amazon
  if (/Amazonbot/i.test(ua)) return "Amazonbot";

  // AI研究機関
  if (/AI2Bot-Dolma/i.test(ua)) return "AI2Bot-Dolma";
  if (/AI2Bot/i.test(ua)) return "AI2Bot";
  if (/AI21Bot/i.test(ua)) return "AI21Bot";
  if (/AIHitBot/i.test(ua)) return "AIHitBot";

  // 検索・クロール
  if (/DuckDuckBot/i.test(ua)) return "DuckDuckBot";
  if (/YandexBot/i.test(ua)) return "YandexBot";
  if (/PetalBot/i.test(ua)) return "PetalBot";
  if (/Bytespider/i.test(ua)) return "Bytespider";
  if (/CCBot/i.test(ua)) return "CCBot";
  if (/BLEXBot/i.test(ua)) return "BLEXBot";

  // SEOツール
  if (/SemrushBot/i.test(ua)) return "SemrushBot";
  if (/AhrefsBot/i.test(ua)) return "AhrefsBot";
  if (/DataForSeoBot/i.test(ua)) return "DataForSeoBot";
  if (/MJ12bot/i.test(ua)) return "MJ12bot";
  if (/DotBot/i.test(ua)) return "DotBot";

  // モニタリング
  if (/AwarioSmartBot/i.test(ua)) return "AwarioSmartBot";
  if (/AwarioRssBot/i.test(ua)) return "AwarioRssBot";

  return null;
}

// ========================================
// ASNベースの補完判定
// ========================================
const ASN_MAP: Record<string, string> = {
  "15169": "Google-Unverified",
  "8075": "Microsoft-Unverified",
  "14618": "Amazon-Unverified",
  "16509": "Amazon-Unverified",
  "13335": "Cloudflare",
  "14061": "DigitalOcean",
  "24940": "Hetzner",
  "16276": "OVH",
  "9009": "M247-Scraper",
  "132203": "Tencent-Cloud",
};

function detectBotByASN(asn: string | null): string | null {
  if (!asn) return null;
  return ASN_MAP[asn] || null;
}

// ========================================
// 悪質Botパターン検出
// ========================================
const MALICIOUS_PATTERNS = [
  // WordPress探索
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-content/i,
  /\/wordpress/i,
  /\/xmlrpc\.php/i,
  // 設定ファイル探索
  /\/\.env/i,
  /\/\.git/i,
  /\/\.ssh/i,
  /\/config\.(php|yml|yaml|json|ini)/i,
  /\/setup-config\.php/i,
  /\/configuration\.php/i,
  /\/settings\.php/i,
  // 管理画面探索
  /\/admin\.php/i,
  /\/phpmyadmin/i,
  /\/phpinfo/i,
  /\/shell\.php/i,
  /\/cmd\.php/i,
  /\/eval-stdin\.php/i,
  // バックアップファイル
  /\/backup/i,
  /\/dump\.sql/i,
  /\/db\.sql/i,
  /\/database\.sql/i,
  // 脆弱性スキャン
  /\/etc\/passwd/i,
  /\/proc\/self/i,
  /\/vendor\/phpunit/i,
];

function isMaliciousPath(pathname: string): boolean {
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(pathname));
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
    const asn = request.headers.get("x-vercel-ip-as-number") || null;

    const isHoneypot =
      pathname.includes("/hidden-trap/") || pathname.includes("/llm-internal/");
    const isMalicious = isMaliciousPath(pathname);

    const botByUA = detectBotByUA(ua);
    const botByASN = detectBotByASN(asn);
    const botType = botByUA || botByASN || null;

    const verificationLevel = botByUA ? 1 : 0;

    const { error } = await supabase.from("access_logs").insert({
      ip_hash: await hashIp(ip),
      ua: ua || null,
      path,
      bot_type: botType,
      verification_level: verificationLevel,
      is_honeypot: isHoneypot,
      is_malicious: isMalicious,
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
