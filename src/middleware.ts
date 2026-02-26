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
  if (!ua) return null;

  // Anthropic
  if (/ClaudeBot/i.test(ua))     return "ClaudeBot";
  if (/Claude-Web/i.test(ua))    return "Claude-Web";
  if (/anthropic-ai/i.test(ua))  return "AnthropicBot";

  // OpenAI
  if (/GPTBot/i.test(ua))        return "GPTBot";
  if (/ChatGPT-User/i.test(ua))  return "ChatGPT-User";
  if (/OAI-SearchBot/i.test(ua)) return "OAI-SearchBot";

  // Google
  if (/Google-CloudVertexBot/i.test(ua))   return "Google-CloudVertexBot";
  if (/Google-Extended/i.test(ua))         return "Google-Extended";
  if (/Google-InspectionTool/i.test(ua))   return "Google-InspectionTool";
  if (/Googlebot-Image/i.test(ua))         return "Googlebot-Image";
  if (/AdsBot-Google/i.test(ua))           return "AdsBot-Google";
  if (/GoogleOther/i.test(ua))             return "GoogleOther";
  if (/Googlebot/i.test(ua))               return "Googlebot";
  if (/Bard/i.test(ua))                    return "Bard";

  // Apple
  if (/Applebot-Extended/i.test(ua)) return "Applebot-Extended";
  if (/Applebot/i.test(ua))          return "Applebot";

  // Microsoft
  if (/Bingbot/i.test(ua)) return "Bingbot";

  // Perplexity
  if (/PerplexityBot/i.test(ua)) return "PerplexityBot";

  // Meta
  if (/Meta-ExternalAgent/i.test(ua))   return "Meta-ExternalAgent";
  if (/Meta-ExternalFetcher/i.test(ua)) return "Meta-ExternalFetcher";
  if (/FacebookBot/i.test(ua))          return "FacebookBot";

  // Amazon
  if (/Amazonbot/i.test(ua)) return "Amazonbot";

  // AI研究機関
  if (/AI2Bot-Dolma/i.test(ua)) return "AI2Bot-Dolma";
  if (/AI2Bot/i.test(ua))       return "AI2Bot";
  if (/AI21Bot/i.test(ua))      return "AI21Bot";
  if (/AIHitBot/i.test(ua))     return "AIHitBot";

  // 検索・クロール
  if (/DuckDuckBot/i.test(ua)) return "DuckDuckBot";
  if (/YandexBot/i.test(ua))   return "YandexBot";
  if (/PetalBot/i.test(ua))    return "PetalBot";
  if (/Bytespider/i.test(ua))  return "Bytespider";
  if (/CCBot/i.test(ua))       return "CCBot";
  if (/BLEXBot/i.test(ua))     return "BLEXBot";

  // SEOツール
  if (/SemrushBot/i.test(ua))   return "SemrushBot";
  if (/AhrefsBot/i.test(ua))    return "AhrefsBot";
  if (/DataForSeoBot/i.test(ua)) return "DataForSeoBot";
  if (/MJ12bot/i.test(ua))      return "MJ12bot";
  if (/DotBot/i.test(ua))       return "DotBot";

  // モニタリング
  if (/AwarioSmartBot/i.test(ua)) return "AwarioSmartBot";
  if (/AwarioRssBot/i.test(ua))   return "AwarioRssBot";

  return null;
}

// ========================================
// ASNベースの補完判定
// ========================================
const ASN_MAP: Record<string, string> = {
  "15169":  "Google-Unverified",
  "8075":   "Microsoft-Unverified",
  "14618":  "Amazon-Unverified",
  "16509":  "Amazon-Unverified",
  "13335":  "Cloudflare",
  "14061":  "DigitalOcean",
  "24940":  "Hetzner",
  "16276":  "OVH",
  "9009":   "M247-Scraper",
  "132203": "Tencent-Cloud",
};

function detectBotByASN(asn: string | null): string | null {
  if (!asn) return null;
  return ASN_MAP[asn] || null;
}

// ========================================
// 悪質パス判定（カテゴリ別）
// ========================================
const MALICIOUS_RULES: { pattern: RegExp; category: string }[] = [
  // WordPress探索
  { pattern: /\/wp-admin/i,          category: "Scan-WordPress" },
  { pattern: /\/wp-login/i,          category: "Scan-WordPress" },
  { pattern: /\/wp-content/i,        category: "Scan-WordPress" },
  { pattern: /\/wordpress/i,         category: "Scan-WordPress" },
  { pattern: /\/xmlrpc\.php/i,       category: "Scan-WordPress" },
  { pattern: /\/wp-includes/i,       category: "Scan-WordPress" },
  { pattern: /\/wp-json/i,           category: "Scan-WordPress" },
  // 設定ファイル探索
  { pattern: /\/\.env\./i,           category: "Scan-ConfigLeak" },
  { pattern: /\/artisan/i,           category: "Scan-ConfigLeak" },
  { pattern: /\/\.env/i,             category: "Scan-ConfigLeak" },
  { pattern: /\/\.git/i,             category: "Scan-ConfigLeak" },
  { pattern: /\/\.ssh/i,             category: "Scan-ConfigLeak" },
  { pattern: /\/config\.(php|yml|yaml|json|ini)/i, category: "Scan-ConfigLeak" },
  { pattern: /\/setup-config\.php/i, category: "Scan-ConfigLeak" },
  { pattern: /\/configuration\.php/i,category: "Scan-ConfigLeak" },
  { pattern: /\/settings\.php/i,     category: "Scan-ConfigLeak" },
  { pattern: /\/v1\/config/i,        category: "Scan-ConfigLeak" },
  { pattern: /\/actuator/i,          category: "Scan-ConfigLeak" },  // Spring Boot
  { pattern: /\/swagger/i,           category: "Scan-ConfigLeak" },
  // 管理画面探索
  { pattern: /\/admin\.php/i,        category: "Scan-AdminProbe" },
  { pattern: /\/phpmyadmin/i,        category: "Scan-AdminProbe" },
  { pattern: /\/phpinfo/i,           category: "Scan-AdminProbe" },
  { pattern: /\/shell\.php/i,        category: "Scan-AdminProbe" },
  { pattern: /\/cmd\.php/i,          category: "Scan-AdminProbe" },
  { pattern: /\/eval-stdin\.php/i,   category: "Scan-AdminProbe" },
  // バックアップファイル
  { pattern: /\/backup/i,            category: "Scan-Backup" },
  { pattern: /\/dump\.sql/i,         category: "Scan-Backup" },
  { pattern: /\/db\.sql/i,           category: "Scan-Backup" },
  { pattern: /\/database\.sql/i,     category: "Scan-Backup" },
  // 脆弱性スキャン
  { pattern: /\/\.DS_Store/i,        category: "Scan-Vuln" },
  { pattern: /\/\.htaccess/i,        category: "Scan-Vuln" },
  { pattern: /\/\.htpasswd/i,        category: "Scan-Vuln" },
  { pattern: /\/cgi-bin/i,           category: "Scan-Vuln" },
  { pattern: /\/etc\/passwd/i,       category: "Scan-Vuln" },
  { pattern: /\/proc\/self/i,        category: "Scan-Vuln" },
  { pattern: /\/vendor\/phpunit/i,   category: "Scan-Vuln" },
  { pattern: /\.\.\//,               category: "Scan-Traversal" },
  { pattern: /%2e%2e%2f/i,           category: "Scan-Traversal" },
];

function detectMaliciousPath(pathname: string): string | null {
  for (const { pattern, category } of MALICIOUS_RULES) {
    if (pattern.test(pathname)) return category;
  }
  return null;
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
    const ua  = request.headers.get("user-agent") || "";
    const path = pathname + (request.nextUrl.search || "");
    const asn  = request.headers.get("x-vercel-ip-as-number") || null;

    const isHoneypot =
      pathname.includes("/hidden-trap/") || pathname.includes("/llm-internal/");

    // ── 判定優先順位 ──────────────────────────
    // 1. UA判定         → level 1
    // 2. 悪質パス判定   → level 3（カテゴリ名で上書き）
    // 3. ASN判定        → level 2
    // ─────────────────────────────────────────
    const botByUA       = detectBotByUA(ua);
    const maliciousCat  = detectMaliciousPath(path);
    const botByASN      = detectBotByASN(asn);

    let botType           = botByUA || botByASN || null;
    let verificationLevel = botByUA ? 1 : botByASN ? 2 : 0;
    let isMalicious       = false;

    // 悪質パスが検出された場合はbot_typeをカテゴリ名で上書きしてlevel=3
    // ASNが既知なら "Cloudflare-Scan-ConfigLeak" のように組み合わせる
    if (maliciousCat) {
      const asnLabel = botByASN ? `${botByASN}-` : "";
      botType           = `${asnLabel}${maliciousCat}`;
      verificationLevel = 3;
      isMalicious       = true;
    }

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
