// 場所: src/app/admin/crawlers/page.tsx
// クローラー行動パターン分析ダッシュボード（非公開）

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { isMaliciousPath } from "@/lib/malicious-patterns";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}

// ========================================
// 型定義
// ========================================
type LogRow = {
  created_at: string;
  ip_hash: string;
  path: string;
  bot_type: string | null;
  asn: string | null;
  is_honeypot: boolean;
  is_malicious: boolean;
  ua: string | null;
};

type Session = {
  ip_hash: string;
  bot_type: string | null;
  asn: string | null;
  ua: string | null;
  paths: string[];
  timestamps: string[];
  pattern: CrawlPattern;
  is_malicious: boolean;
  honeypot_hits: number;
  duration_minutes: number;
};

type CrawlPattern =
  | "MALICIOUS"
  | "BATCH"
  | "SEQUENTIAL"
  | "WANDERING"
  | "LINK_FOLLOW"
  | "SINGLE";

// ========================================
// 既知の内部リンク構造
// ========================================
const INTERNAL_LINKS: Record<string, string[]> = {
  "/": ["/articles", "/terms/geo-shock-index-a", "/experiments"],
  "/articles": [
    "/articles/what-is-geo",
    "/articles/why-jsonld-matters",
    "/articles/ai-and-content-creators",
    "/articles/what-is-aio",
    "/articles/what-is-aeo",
    "/articles/what-is-ai-seo",
    "/articles/what-is-ai-search",
  ],
  "/terms": ["/terms/geo-shock-a", "/terms/geo-shock-index-a"],
  "/experiments": [],
  "/stats": [],
};

// ========================================
// セッション化（30分以内 = 同一セッション）
// ========================================
function buildSessions(logs: LogRow[]): Session[] {
  // IP_hashでグループ化
  const byIp: Record<string, LogRow[]> = {};
  for (const log of logs) {
    if (!byIp[log.ip_hash]) byIp[log.ip_hash] = [];
    byIp[log.ip_hash].push(log);
  }

  const sessions: Session[] = [];

  for (const [ip_hash, ipLogs] of Object.entries(byIp)) {
    // 時系列順にソート
    ipLogs.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    // 30分ウィンドウでセッション分割
    let sessionStart = 0;
    for (let i = 1; i <= ipLogs.length; i++) {
      const isLast = i === ipLogs.length;
      const gap = isLast
        ? Infinity
        : (new Date(ipLogs[i].created_at).getTime() -
            new Date(ipLogs[i - 1].created_at).getTime()) /
          1000 /
          60;

      if (gap > 30 || isLast) {
        const chunk = ipLogs.slice(sessionStart, i);
        const paths = chunk.map((l) => l.path);
        const timestamps = chunk.map((l) => l.created_at);
        const hasMalicious = chunk.some((l) => l.is_malicious);
        const honeypotHits = chunk.filter((l) => l.is_honeypot).length;

        const first = new Date(timestamps[0]).getTime();
        const last = new Date(timestamps[timestamps.length - 1]).getTime();
        const duration_minutes = Math.round((last - first) / 1000 / 60);

        sessions.push({
          ip_hash,
          bot_type: chunk[0].bot_type,
          asn: chunk[0].asn,
          ua: chunk[0].ua,
          paths,
          timestamps,
          pattern: classifyPattern(paths, timestamps, hasMalicious),
          is_malicious: hasMalicious,
          honeypot_hits: honeypotHits,
          duration_minutes,
        });

        sessionStart = i;
      }
    }
  }

  // 最新セッション順
  return sessions.sort(
    (a, b) =>
      new Date(b.timestamps[b.timestamps.length - 1]).getTime() -
      new Date(a.timestamps[a.timestamps.length - 1]).getTime(),
  );
}

// ========================================
// パターン分類ロジック
// ========================================
function classifyPattern(
  paths: string[],
  timestamps: string[],
  hasMalicious: boolean,
): CrawlPattern {
  const actuallMlicious = hasMalicious || paths.some((p) => isMaliciousPath(p));
  if (hasMalicious) return "MALICIOUS";
  if (paths.length === 1) return "SINGLE";

  // バッチ判定: 1分以内に3件以上
  const times = timestamps.map((t) => new Date(t).getTime());
  let batchCount = 0;
  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] < 60 * 1000) batchCount++;
  }
  if (batchCount >= 2) return "BATCH";

  // リンク予測型: 内部リンクを辿ってるか
  let linkFollowCount = 0;
  for (let i = 1; i < paths.length; i++) {
    const prevLinks = INTERNAL_LINKS[paths[i - 1]] || [];
    if (prevLinks.includes(paths[i])) linkFollowCount++;
  }
  if (linkFollowCount >= 1 && linkFollowCount / (paths.length - 1) > 0.4) {
    return "LINK_FOLLOW";
  }

  // 深掘り判定: 同じセクションを掘り下げてる
  const sections = paths.map((p) => p.split("/")[1] || "root");
  const uniqueSections = new Set(sections);
  if (uniqueSections.size <= 2 && paths.length >= 3) return "SEQUENTIAL";

  // 周遊型: 複数セクションを横断
  if (uniqueSections.size >= 3) return "WANDERING";

  return "SEQUENTIAL";
}

// ========================================
// パターンの色・ラベル
// ========================================
const PATTERN_META: Record<
  CrawlPattern,
  { label: string; color: string; bg: string; desc: string }
> = {
  MALICIOUS: {
    label: "悪質スキャン",
    color: "#DC2626",
    bg: "#FEF2F2",
    desc: "存在しないシステムファイルへの探索",
  },
  BATCH: {
    label: "バッチ型",
    color: "#D97706",
    bg: "#FFFBEB",
    desc: "短時間に複数URLを並列アクセス",
  },
  SEQUENTIAL: {
    label: "直列型",
    color: "var(--primary)",
    bg: "var(--primary-light)",
    desc: "同一セクションを深掘りクロール",
  },
  WANDERING: {
    label: "周遊型",
    color: "#7C3AED",
    bg: "#F5F3FF",
    desc: "複数セクションを横断",
  },
  LINK_FOLLOW: {
    label: "リンク予測型",
    color: "var(--accent)",
    bg: "var(--accent-light)",
    desc: "内部リンクを辿るクロール",
  },
  SINGLE: {
    label: "単発",
    color: "var(--neutral-400)",
    bg: "var(--neutral-100)",
    desc: "1回のみのアクセス",
  },
};

// ========================================
// ページ本体
// ========================================
export default async function CrawlersPage() {
  const isAuthed = await checkAuth();
  if (!isAuthed) redirect("/admin/login");

  // 直近7日のログを取得
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: logs, error } = await supabaseAdmin
    .from("access_logs")
    .select(
      "created_at, ip_hash, path, bot_type, asn, is_honeypot, is_malicious, ua",
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "#DC2626" }}>
        エラー: {error.message}
      </div>
    );
  }

  const sessions = buildSessions((logs as LogRow[]) || []);

  // 集計
  const patternCounts: Record<string, number> = {};
  let maliciousCount = 0;
  let honeypotSessions = 0;
  for (const s of sessions) {
    patternCounts[s.pattern] = (patternCounts[s.pattern] || 0) + 1;
    if (s.is_malicious) maliciousCount++;
    if (s.honeypot_hits > 0) honeypotSessions++;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F172A",
        color: "#E2E8F0",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <a
              href="/admin/logs"
              style={{
                fontSize: "0.8rem",
                color: "#64748B",
                textDecoration: "none",
              }}
            >
              ← アクセスログ
            </a>
          </div>
          <h1
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#F1F5F9",
            }}
          >
            クローラー行動分析
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#64748B",
              marginTop: "0.35rem",
            }}
          >
            直近7日間 / {sessions.length}セッション検出
          </p>
        </div>

        {/* サマリー */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {[
            { label: "総セッション", value: sessions.length, color: "#94A3B8" },
            { label: "悪質スキャン", value: maliciousCount, color: "#F87171" },
            {
              label: "ハニーポット踏破",
              value: honeypotSessions,
              color: "#FBBF24",
            },
            {
              label: "リンク予測型",
              value: patternCounts["LINK_FOLLOW"] || 0,
              color: "#34D399",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#64748B",
                  marginBottom: "0.3rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  fontFamily: "'DM Mono', monospace",
                  color: item.color,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* パターン分布 */}
        <div
          style={{
            background: "#1E293B",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            パターン分布
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {(Object.keys(PATTERN_META) as CrawlPattern[]).map((pattern) => {
              const meta = PATTERN_META[pattern];
              const count = patternCounts[pattern] || 0;
              return (
                <div
                  key={pattern}
                  style={{
                    background: "#0F172A",
                    border: `1px solid ${meta.color}40`,
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    minWidth: "120px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      color: meta.color,
                      fontWeight: 600,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {meta.label}
                  </p>
                  <p
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      fontFamily: "'DM Mono', monospace",
                      color: "#F1F5F9",
                    }}
                  >
                    {count}
                  </p>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      color: "#475569",
                      marginTop: "0.2rem",
                    }}
                  >
                    {meta.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* セッション一覧 */}
        <div
          style={{
            background: "#1E293B",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            セッション一覧（最新200件）
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            {sessions.slice(0, 200).map((session, i) => {
              const meta = PATTERN_META[session.pattern];
              const lastAccess = new Date(
                session.timestamps[session.timestamps.length - 1],
              ).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={i}
                  style={{
                    background: "#0F172A",
                    border: `1px solid ${session.is_malicious ? "#DC262640" : "#1E293B"}`,
                    borderLeft: `3px solid ${meta.color}`,
                    borderRadius: "8px",
                    padding: "0.875rem 1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      {/* ヘッダー行 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            color: meta.color,
                            background: `${meta.color}15`,
                            border: `1px solid ${meta.color}30`,
                            borderRadius: "4px",
                            padding: "0.15em 0.5em",
                          }}
                        >
                          {meta.label}
                        </span>
                        {session.bot_type && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#94A3B8",
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {session.bot_type}
                          </span>
                        )}
                        {session.honeypot_hits > 0 && (
                          <span
                            style={{ fontSize: "0.68rem", color: "#FBBF24" }}
                          >
                            🪤 ×{session.honeypot_hits}
                          </span>
                        )}
                      </div>

                      {/* パス一覧 */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.3rem",
                        }}
                      >
                        {session.paths.slice(0, 8).map((path, j) => (
                          <span
                            key={j}
                            style={{
                              fontSize: "0.68rem",
                              fontFamily: "'DM Mono', monospace",
                              color:
                                session.is_malicious &&
                                MALICIOUS_PATTERNS_CHECK(path)
                                  ? "#F87171"
                                  : "#475569",
                              background:
                                session.is_malicious &&
                                MALICIOUS_PATTERNS_CHECK(path)
                                  ? "#FEF2F215"
                                  : "#1E293B",
                              border: `1px solid ${session.is_malicious && MALICIOUS_PATTERNS_CHECK(path) ? "#DC262630" : "#334155"}`,
                              borderRadius: "3px",
                              padding: "0.1em 0.4em",
                            }}
                          >
                            {path.length > 35 ? path.slice(0, 35) + "…" : path}
                          </span>
                        ))}
                        {session.paths.length > 8 && (
                          <span
                            style={{ fontSize: "0.68rem", color: "#475569" }}
                          >
                            +{session.paths.length - 8}件
                          </span>
                        )}
                      </div>
                    </div>

                    {/* メタ情報 */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "#475569",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {lastAccess}
                      </p>
                      <p
                        style={{
                          fontSize: "0.68rem",
                          color: "#334155",
                          marginTop: "0.2rem",
                        }}
                      >
                        {session.paths.length}リクエスト
                        {session.duration_minutes > 0 &&
                          ` / ${session.duration_minutes}分`}
                      </p>
                      {session.asn && (
                        <p
                          style={{
                            fontSize: "0.65rem",
                            color: "#334155",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          ASN{session.asn}
                        </p>
                      )}
                      <p
                        style={{
                          fontSize: "0.63rem",
                          color: "#1E293B",
                          fontFamily: "'DM Mono', monospace",
                          marginTop: "0.2rem",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {session.ip_hash.slice(0, 8)}…
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// JSX内でも悪質パス判定を使うためのヘルパー
function MALICIOUS_PATTERNS_CHECK(path: string): boolean {
  const patterns = [
    /\/wp-admin/i,
    /\/wp-login/i,
    /\/wp-content/i,
    /\/wordpress/i,
    /\/\.env/i,
    /\/\.git/i,
    /\/\.ssh/i,
    /\/setup-config\.php/i,
    /\/admin\.php/i,
    /\/phpmyadmin/i,
    /\/phpinfo/i,
    /\/shell\.php/i,
    /\/backup/i,
    /\/dump\.sql/i,
    /\/xmlrpc\.php/i,
  ];
  return patterns.some((p) => p.test(path));
}
