// ============================================
// 場所: lib/bot-detection.ts
// ============================================
// ボット判定・ASN照合・DNS検証ロジック。
// /api/log/route.ts から呼び出す。
// ============================================

import { createHash } from "crypto";
import dns from "dns/promises";

// ---------- 既知のAIクローラーUA パターン ----------
const BOT_UA_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /GPTBot/i,              name: "GPTBot" },
  { pattern: /ChatGPT-User/i,        name: "ChatGPT-User" },
  { pattern: /OAI-SearchBot/i,       name: "OAI-SearchBot" },
  { pattern: /Google-Extended/i,     name: "Google-Extended" },
  { pattern: /Googlebot/i,           name: "Googlebot" },
  { pattern: /ClaudeBot/i,           name: "ClaudeBot" },
  { pattern: /Claude-Web/i,          name: "Claude-Web" },
  { pattern: /anthropic-ai/i,        name: "AnthropicBot" },
  { pattern: /PerplexityBot/i,       name: "PerplexityBot" },
  { pattern: /YouBot/i,              name: "YouBot" },
  { pattern: /Applebot/i,            name: "Applebot" },
  { pattern: /Bingbot/i,             name: "Bingbot" },
  { pattern: /DuckDuckBot/i,         name: "DuckDuckBot" },
  { pattern: /facebookexternalhit/i, name: "FacebookBot" },
  { pattern: /Twitterbot/i,          name: "Twitterbot" },
  { pattern: /LinkedInBot/i,         name: "LinkedInBot" },
  { pattern: /Slackbot/i,            name: "Slackbot" },
  { pattern: /CCBot/i,               name: "CCBot" },         // Common Crawl
  { pattern: /DataForSeoBot/i,       name: "DataForSeoBot" },
  { pattern: /SemrushBot/i,          name: "SemrushBot" },
  { pattern: /AhrefsBot/i,           name: "AhrefsBot" },
  // UA未設定のアクセス（ボットの可能性高）
  { pattern: /^$/,                   name: "EmptyUA" },
];

// ---------- 主要AI企業のASNリスト ----------
// 出典: ARIN/RIPE公開データ（随時更新が必要）
const KNOWN_BOT_ASNS: Record<string, string> = {
  "15169": "Google",
  "19527": "Google",
  "36040": "Google",
  "8075":  "Microsoft/Bing",
  "8068":  "Microsoft",
  "16509": "Amazon/AWS",    // OpenAIはAWS上で動作することが多い
  "14618": "Amazon/AWS",
  "54113": "Fastly",
  "20940": "Akamai",
  "13335": "Cloudflare",
};

// ---------- IPハッシュ化 ----------
export function hashIp(ip: string): string {
  const salt = process.env.LOG_SALT || "fallback_salt_change_this";
  return createHash("sha256")
    .update(ip + salt)
    .digest("hex");
}

// ---------- UAからボット名を判定 ----------
export function detectBotFromUA(ua: string): {
  botName: string | null;
  verificationLevel: number;
} {
  if (!ua) {
    return { botName: "EmptyUA", verificationLevel: 1 };
  }

  for (const { pattern, name } of BOT_UA_PATTERNS) {
    if (pattern.test(ua)) {
      return { botName: name, verificationLevel: 1 };
    }
  }

  return { botName: null, verificationLevel: 0 };
}

// ---------- ASN照合（Level 2） ----------
export function checkASN(
  asn: string | null,
  botName: string | null
): { verified: boolean; asnOwner: string | null } {
  if (!asn) return { verified: false, asnOwner: null };

  // "AS15169" 形式と "15169" 形式の両方に対応
  const asnNumber = asn.replace(/^AS/i, "");
  const owner = KNOWN_BOT_ASNS[asnNumber] || null;

  return { verified: !!owner, asnOwner: owner };
}

// ---------- 逆DNS検証（Googlebot専用 Level 3） ----------
// Googlebotの正規検証手順:
// 1. IPを逆引き → ホスト名取得
// 2. ホスト名が *.googlebot.com か *.google.com か確認
// 3. そのホスト名を正引き → 元のIPと一致するか確認
export async function verifyGooglebot(ip: string): Promise<boolean> {
  if (!ip || ip === "unknown") return false;

  try {
    // Step 1: 逆引き
    const hostnames = await dns.reverse(ip);
    if (!hostnames || hostnames.length === 0) return false;

    const hostname = hostnames[0];

    // Step 2: ドメイン確認
    const isGoogleDomain =
      hostname.endsWith(".googlebot.com") ||
      hostname.endsWith(".google.com");

    if (!isGoogleDomain) return false;

    // Step 3: 正引きで突合
    const addresses = await dns.resolve4(hostname);
    return addresses.includes(ip);
  } catch {
    // DNS解決失敗 = 偽装の可能性あり
    return false;
  }
}

// ---------- 統合判定関数 ----------
export async function analyzeBotRequest(params: {
  ip: string;
  ua: string;
  asn: string | null;
}): Promise<{
  ip_hash: string;
  bot_type: string | null;
  verification_level: number;
  asn: string | null;
}> {
  const { ip, ua, asn } = params;

  // IPハッシュ化（生IPは保存しない）
  const ip_hash = hashIp(ip);

  // Step 1: UAベースの判定
  const { botName, verificationLevel } = detectBotFromUA(ua);
  let finalBotType = botName;
  let finalLevel = verificationLevel;

  // Step 2: ASN照合
  if (asn) {
    const { verified, asnOwner } = checkASN(asn, botName);
    if (verified) {
      finalLevel = Math.max(finalLevel, 2);
      // UAが未判定でもASNが既知のAI企業なら記録
      if (!finalBotType && asnOwner) {
        finalBotType = `Unknown/${asnOwner}`;
      }
    }
  }

  // Step 3: Googlebotの場合のみ逆DNS検証
  if (
    finalBotType === "Googlebot" ||
    finalBotType === "Google-Extended"
  ) {
    const isVerified = await verifyGooglebot(ip);
    if (isVerified) {
      finalLevel = 3;
    }
  }

  return {
    ip_hash,
    bot_type: finalBotType,
    verification_level: finalLevel,
    asn: asn,
  };
}
