// 場所: src/app/stats/page.tsx
import { supabaseAdmin } from "@/lib/supabase";
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com"}/stats`;

export const metadata = {
  title: "観測レポート — GEO Findings",
  description:
    "GEO Findings のAIクローラー観測データを公開。今月・今週の来訪ボット数・ASN別訪問数をリアルタイムで集計。",
  alternates: { canonical: PAGE_URL },
};

export const dynamic = "force-dynamic";

// ----------------------------------------
// ASNラベル（bot-detection.ts と合わせて管理）
// ----------------------------------------
const ASN_LABELS: Record<
  string,
  { name: string; type: "ai" | "cloud" | "scraper" | "other" }
> = {
  "15169": { name: "Google", type: "ai" },
  "19527": { name: "Google", type: "ai" },
  "36040": { name: "Google", type: "ai" },
  "16509": { name: "Amazon / AWS", type: "cloud" },
  "14618": { name: "Amazon / AWS", type: "cloud" },
  "8075": { name: "Microsoft", type: "ai" },
  "8068": { name: "Microsoft", type: "ai" },
  "13335": { name: "Cloudflare", type: "cloud" },
  "14061": { name: "DigitalOcean", type: "cloud" },
  "24940": { name: "Hetzner", type: "cloud" },
  "16276": { name: "OVH", type: "cloud" },
  "9009": { name: "M247", type: "scraper" },
  "132203": { name: "Tencent Cloud", type: "scraper" },
  "396982": { name: "Google Cloud", type: "cloud" },
  "63949": { name: "Linode", type: "cloud" },
  "45102": { name: "Alibaba Cloud", type: "cloud" },
  "54113": { name: "Fastly", type: "cloud" },
  "20940": { name: "Akamai", type: "cloud" },
  "3257": { name: "GTT", type: "other" },
  "174": { name: "Cogent", type: "other" },
  "2516": { name: "KDDI", type: "other" },
};

// ----------------------------------------
// verification_level の意味
// 0: 不明 / 1: UA判定 / 2: ASN補完 / 3: 悪質パス確定
// ----------------------------------------
function getSourceLabel(level: number): {
  source: "ua" | "asn" | "scan";
  label: string;
} {
  if (level >= 3) return { source: "scan", label: "SCAN" };
  if (level >= 2) return { source: "asn", label: "ASN" };
  return { source: "ua", label: "UA" };
}

// ----------------------------------------
// RPC レスポンス型
// ----------------------------------------
type BotStatRow = {
  bot_type: string;
  verification_level: number;
  cnt: number; // bigint は JS では number で来る
};

type AsnStatRow = {
  asn: string;
  cnt: number;
};

// ----------------------------------------
// 集計後の整形型
// ----------------------------------------
type BotEntry = {
  name: string;
  count: number;
  level: number; // verification_level
};

type StatsResult = {
  botEntries: BotEntry[];
  totalBots: number;
};

// ----------------------------------------
// RPC結果を整形
// ----------------------------------------
function buildStats(rows: BotStatRow[]): StatsResult {
  // 同じbot_typeでlevelが違う行をマージ（levelは最大値を採用）
  const merged: Record<string, { count: number; level: number }> = {};
  for (const row of rows) {
    const cnt = Number(row.cnt);
    if (!merged[row.bot_type]) {
      merged[row.bot_type] = { count: 0, level: 0 };
    }
    merged[row.bot_type].count += cnt;
    merged[row.bot_type].level = Math.max(
      merged[row.bot_type].level,
      row.verification_level,
    );
  }

  const botEntries: BotEntry[] = Object.entries(merged)
    .map(([name, { count, level }]) => ({
      name,
      count,
      level,
    }))
    .sort((a, b) => b.count - a.count);

  const totalBots = botEntries.reduce((s, e) => s + e.count, 0);

  return { botEntries, totalBots };
}

// ----------------------------------------
// 日付
// ----------------------------------------
function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getMonthStart() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ----------------------------------------
// 判定元バッジ
// ----------------------------------------
function SourceBadge({
  source,
  label,
}: {
  source: "ua" | "asn" | "scan";
  label: string;
}) {
  const styles: Record<string, { bg: string; color: string; border: string }> =
    {
      ua: { bg: "#EFF6FF", color: "#2563EB", border: "#93C5FD" },
      asn: { bg: "#F0FDF4", color: "#16A34A", border: "#86EFAC" },
      scan: { bg: "#FFF7ED", color: "#EA580C", border: "#FDC8A4" },
    };
  const s = styles[source];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        padding: "1px 4px",
        borderRadius: "3px",
        flexShrink: 0,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        lineHeight: 1.4,
        verticalAlign: "middle",
      }}
    >
      {label}
    </span>
  );
}

// ----------------------------------------
// 統計パネル
// ----------------------------------------
function StatsPanel({
  label,
  stats,
  asnRows,
  totalCount,
  honeypotCount,
}: {
  label: string;
  stats: StatsResult;
  asnRows: AsnStatRow[];
  totalCount: number;
  honeypotCount: number;
}) {
  const typeColor: Record<string, string> = {
    ai: "#9CA3AF",
    cloud: "#9CA3AF",
    scraper: "#9CA3AF",
    other: "#9CA3AF",
  };

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <p className="section-label" style={{ marginBottom: "1rem" }}>
        {label}の統計
      </p>

      {/* ── サマリー 2×2 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        {[
          { label: "総アクセス", value: totalCount },
          { label: "ボット来訪", value: stats.totalBots },
          { label: "🪤 ハニーポット", value: honeypotCount },
          { label: "検出種別数", value: stats.botEntries.length },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--neutral-100, #F3F4F6)",
              borderRadius: "var(--radius-sm, 6px)",
              padding: "0.65rem 0.75rem",
            }}
          >
            <p
              style={{
                fontSize: "0.68rem",
                color: "var(--neutral-400, #9CA3AF)",
                marginBottom: "0.2rem",
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                color: "var(--neutral, #111827)",
              }}
            >
              {item.value.toLocaleString("ja-JP")}
            </p>
          </div>
        ))}
      </div>

      {/* ── ボット種別バーグラフ ── */}
      <div style={{ marginBottom: "1.25rem" }}>
        {/* ヘッダー + 凡例 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "0.7rem",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "var(--neutral-400, #9CA3AF)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            ボット種別
          </p>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {(["ua", "asn", "scan"] as const).map((s) => {
              const { source, label: l } = getSourceLabel(
                s === "ua" ? 1 : s === "asn" ? 2 : 3,
              );
              return (
                <span
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <SourceBadge source={source} label={l} />
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--neutral-400, #9CA3AF)",
                    }}
                  >
                    {s === "ua"
                      ? "UA判定"
                      : s === "asn"
                        ? "ASN判定"
                        : "不審アクセス"}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {stats.botEntries.length === 0 ? (
          <p style={{ fontSize: "0.8rem", color: "var(--neutral-400)" }}>
            データなし
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
          >
            {stats.botEntries.map(({ name, count, level }) => {
              const pct = Math.round((count / (stats.totalBots || 1)) * 100);
              const { source, label: badgeLabel } = getSourceLabel(level);
              // 判定元で色を統一（バッジ・文字・バー全部同じ色）
              const sourceColor: Record<string, string> = {
                ua: "#2563EB",
                asn: "#16A34A",
                scan: "#EA580C",
              };
              const color = sourceColor[source] ?? "#9CA3AF";
              return (
                <div key={name}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      marginBottom: "0.2rem",
                      minWidth: 0,
                    }}
                  >
                    <SourceBadge source={source} label={badgeLabel} />
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontFamily: "'DM Mono', monospace",
                        color,
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                    >
                      {name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontFamily: "'DM Mono', monospace",
                        color: "var(--neutral-400, #9CA3AF)",
                        flexShrink: 0,
                      }}
                    >
                      {count.toLocaleString("ja-JP")}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--border, #E5E7EB)",
                      borderRadius: "999px",
                      height: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: color,
                        borderRadius: "999px",
                        minWidth: pct > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ASN別訪問数 ── */}
      <div>
        <p
          style={{
            fontSize: "0.68rem",
            fontWeight: 600,
            color: "var(--neutral-400, #9CA3AF)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.6rem",
          }}
        >
          ASN別訪問数 (top 10)
        </p>
        {asnRows.length === 0 ? (
          <p style={{ fontSize: "0.8rem", color: "var(--neutral-400)" }}>
            データなし
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            {asnRows.map((row) => {
              const asnNum = row.asn.replace(/^AS/i, "");
              const info = ASN_LABELS[asnNum];
              const color = info ? typeColor[info.type] : "#9CA3AF";
              return (
                <div
                  key={row.asn}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      color: "#9CA3AF",
                      fontSize: "0.7rem",
                      width: "52px",
                      flexShrink: 0,
                    }}
                  >
                    {asnNum}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "0.75rem",
                      color,
                      fontWeight: info ? 500 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    {info ? info.name : "Unknown"}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      color: "var(--neutral-600, #4B5563)",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {Number(row.cnt).toLocaleString("ja-JP")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// ページ本体
// ========================================
export default async function StatsPage() {
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  // ── 全クエリ並列実行 ──
  const [
    { count: monthTotalCount },
    { count: weekTotalCount },
    { count: monthHoneypotCount },
    { count: weekHoneypotCount },
    { data: monthBotRows },
    { data: weekBotRows },
    { data: monthAsnRows },
    { data: weekAsnRows },
  ] = await Promise.all([
    // COUNT（軽量）
    supabaseAdmin
      .from("access_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart),
    supabaseAdmin
      .from("access_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart),
    supabaseAdmin
      .from("access_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart)
      .eq("is_honeypot", true),
    supabaseAdmin
      .from("access_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart)
      .eq("is_honeypot", true),
    // RPC（DB側でGROUP BY・全件対象）
    supabaseAdmin.rpc("get_bot_stats", { since: monthStart }),
    supabaseAdmin.rpc("get_bot_stats", { since: weekStart }),
    supabaseAdmin.rpc("get_asn_stats", { since: monthStart }),
    supabaseAdmin.rpc("get_asn_stats", { since: weekStart }),
  ]);

  const monthStats = buildStats((monthBotRows as BotStatRow[]) || []);
  const weekStats = buildStats((weekBotRows as BotStatRow[]) || []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "GEO Findings AIクローラー観測レポート",
    description:
      "AIクローラーの来訪頻度・ASN分布・ハニーポット踏破率の公開観測データ",
    url: PAGE_URL,
    creator: { "@type": "Organization", name: "GEO Findings" },
    dateModified: new Date().toISOString(),
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* ── ページヘッダー ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid var(--accent)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>
          Live Observatory
        </p>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
          観測レポート
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--neutral-600)",
            lineHeight: 1.65,
          }}
        >
          GEO Findings に来訪したAIクローラーの集計データを公開しています。
          生のアクセスログは非公開。集計値のみ開示。
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--neutral-400)",
            marginTop: "0.6rem",
          }}
        >
          最終更新:{" "}
          {new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
        </p>
      </div>

      {/* ── 今週・今月パネル SP:1列 / MD以上:2列 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <StatsPanel
          label="今週"
          stats={weekStats}
          asnRows={(weekAsnRows as AsnStatRow[]) || []}
          totalCount={weekTotalCount ?? 0}
          honeypotCount={weekHoneypotCount ?? 0}
        />
        <StatsPanel
          label="今月"
          stats={monthStats}
          asnRows={(monthAsnRows as AsnStatRow[]) || []}
          totalCount={monthTotalCount ?? 0}
          honeypotCount={monthHoneypotCount ?? 0}
        />
      </div>

      {/* ── 判定方法の説明 SP:1列 / SM以上:2列 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {[
          {
            source: "ua" as const,
            label: "UA",
            title: "UA判定",
            bg: "#EFF6FF",
            border: "#BFDBFE",
            left: "#2563EB",
            desc: "UA（User-Agent）はブラウザやボットがリクエスト時に送る自己申告の識別文字列。GPTBot・ClaudeBot などのパターンで識別。信頼度が高い。",
          },
          {
            source: "asn" as const,
            label: "ASN",
            title: "ASN判定",
            bg: "#F0FDF4",
            border: "#BBF7D0",
            left: "#16A34A",
            desc: "ASN（Autonomous System Number）はIPアドレスブロックの管理番号。UAでは判別できなかったが、送信元のASNが既知のAI企業ネットワークに属するもの。",
          },
          {
            source: "scan" as const,
            label: "SCAN",
            title: "不審アクセス",
            bg: "#FFF7ED",
            border: "#FED7AA",
            left: "#EA580C",
            desc: "WordPress探索・設定ファイル漏洩・管理画面探索・パストラバーサルなど、明らかに悪意あるパターンへのアクセス。UAやASNに関係なくパスで確定判定。",
          },
        ].map((item) => (
          <div
            key={item.source}
            style={{
              background: item.bg,
              border: `1px solid ${item.border}`,
              borderLeft: `4px solid ${item.left}`,
              borderRadius: "var(--radius-sm)",
              padding: "0.85rem 1rem",
              fontSize: "0.82rem",
              color: "var(--neutral-800)",
              lineHeight: 1.65,
            }}
          >
            <p
              style={{
                fontWeight: 700,
                marginBottom: "0.3rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <SourceBadge source={item.source} label={item.label} />
              {item.title}
            </p>
            <p style={{ margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── 注意事項 ── */}
      <div
        style={{
          background: "var(--neutral-50, #F9FAFB)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid var(--neutral-400)",
          borderRadius: "var(--radius-sm)",
          padding: "1rem 1.25rem",
          fontSize: "0.85rem",
          color: "var(--neutral-800)",
          lineHeight: 1.7,
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>
          観測の注意事項
        </p>
        <p style={{ margin: 0 }}>
          このデータはAIクローラーが「来訪した」ことを示すものであり、
          コンテンツが生成AIの回答に「引用された」ことを示すものではありません。
          クロール ≠ 引用。この違いがGEO観測の核心的な限界です。
        </p>
      </div>
    </div>
  );
}
