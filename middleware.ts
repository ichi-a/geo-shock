// ============================================
// 場所: middleware.ts  （プロジェクトルート）
// ============================================
// Edge Runtime で動作。
// 全アクセスをフックし、レスポンス返却後に非同期で /api/log へ送信。
// 重い処理（ハッシュ化・DNS検証）は /api/log (Node Runtime) 側で行う。
// ============================================

import { NextRequest, NextResponse } from "next/server";

// ロギングをスキップするパスのプレフィックス
const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的アセットはスキップ
  const shouldSkip = SKIP_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (shouldSkip) {
    return NextResponse.next();
  }

  // レスポンスを先に返す
  const response = NextResponse.next();

  // ---------- ロギングデータの収集 ----------
  // Vercel環境では x-forwarded-for が信頼できるIPを持つ
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const ua = request.headers.get("user-agent") || "";
  const path = pathname + (request.nextUrl.search || "");

  // ハニーポット判定（/hidden-trap/ または /llm-internal/ へのアクセス）
  const isHoneypot =
    pathname.includes("/hidden-trap/") || pathname.includes("/llm-internal/");

  // 主要ヘッダーを収集（Vercel固有ヘッダーを含む）
  const headersToCapture: Record<string, string> = {};
  const headerKeys = [
    "accept",
    "accept-language",
    "accept-encoding",
    "referer",
    "sec-ch-ua",
    "sec-fetch-site",
    "x-vercel-ip-as-number", // ASN情報（Vercel自動付与）
    "x-vercel-ip-country",
    "cache-control",
  ];
  for (const key of headerKeys) {
    const val = request.headers.get(key);
    if (val) headersToCapture[key] = val;
  }

  // ASN（Vercelが自動でヘッダーに付与する）
  const asn = request.headers.get("x-vercel-ip-as-number") || null;

  // ---------- 非同期でログAPIへ送信 ----------
  // waitUntil を使わず fetch を投げる。
  // Edge Runtime の制約上、レスポンス返却後に処理を続けるには
  // 以下のように fire-and-forget で送る。
  // （Vercel Edge Middleware は waitUntil をサポートしていないため）
  const logPayload = {
    ip,
    ua,
    path,
    is_honeypot: isHoneypot,
    asn,
    headers_json: headersToCapture,
  };

  // /api/log への内部fetch（fire-and-forget）
  // エラーを握りつぶすことで、ロギング失敗がユーザー体験に影響しない
const host = request.headers.get("host") ?? "localhost:3000";
const protocol = host.includes("localhost") ? "http" : "https";
const siteUrl = `${protocol}://${host}`;

fetch(`${siteUrl}/api/log`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(logPayload),
}).catch(() => {});

  return response;
}

export const config = {
  matcher: [
    /*
     * 以下を除く全パスにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico
     * api/log 自身への再帰呼び出しも除外
     */
    "/((?!_next/static|_next/image|favicon.ico|api/log).*)",
  ],
};
