// 場所: src/app/stats/page.tsx
import { supabaseAdmin } from "@/lib/supabase";
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com"}/stats`;

export const metadata = {
  title: "観測レポート — GEO Lab",
  description: "GEO Lab のAIクローラー観測データを公開。今月・今週の来訪ボット数・ASN別訪問数をリアルタイムで集計。",
  alternates: { canonical: PAGE_URL },
};

export const dynamic = "force-dynamic";

const ASN_LABELS: Record<string, { name: string; type: "ai" | "cloud" | "scraper" | "other" }> = {
  "15169":  { name: "Google",        type: "ai" },
  "16509":  { name: "Amazon / AWS",  type: "cloud" },
  "14618":  { name: "Amazon / AWS",  type: "cloud" },
  "8075":   { name: "Microsoft",     type: "ai" },
  "13335":  { name: "Cloudflare",    type: "cloud" },
  "14061":  { name: "DigitalOcean",  type: "cloud" },
  "24940":  { name: "Hetzner",       type: "cloud" },
  "16276":  { name: "OVH",           type: "cloud" },
  "9009":   { name: "M247",          type: "scraper" },
  "132203": { name: "Tencent Cloud", type: "scraper" },
  "396982": { name: "Google Cloud",  type: "cloud" },
  "63949":  { name: "Linode",        type: "cloud" },
  "45102":  { name: "Alibaba Cloud", type: "cloud" },
  "3257":   { name: "GTT",           type: "other" },
  "174":    { name: "Cogent",        type: "other" },
  "2516":   { name: "KDDI",          type: "other" },
};

type LogRow = {
  created_at: string;
  bot_type: string | null;
  is_honeypot: boolean;
  asn: string | null;
  path: string;
};

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

function calcStats(logs: LogRow[]) {
  const botCounts: Record<string, number> = {};
  const asnCounts: Record<string, number> = {};
  let honeypotHits = 0;
  let totalBots = 0;

  for (const log of logs) {
    const bot = log.bot_type || "Human/Unknown";
    botCounts[bot] = (botCounts[bot] || 0) + 1;
    if (log.bot_type) totalBots++;
    if (log.asn) asnCounts[log.asn] = (asnCounts[log.asn] || 0) + 1;
    if (log.is_honeypot) honeypotHits++;
  }

  return { botCounts, asnCounts, honeypotHits, totalBots };
}

// ========================================
// 統計パネル（今週・今月共通）
// ========================================
function StatsPanel({ label, data, logs }: {
  label: string;
  data: ReturnType<typeof calcStats>;
  logs: LogRow[];
}) {
  const typeColor: Record<string, string> = {
    ai:      "var(--primary)",
    cloud:   "var(--accent)",
    scraper: "#DC2626",
    other:   "var(--neutral-400)",
  };

  const botEntries = Object.entries(data.botCounts)
    .filter(([k]) => k !== "Human/Unknown")
    .sort(([, a], [, b]) => b - a);

  const asnEntries = Object.entries(data.asnCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <p className="section-label" style={{ marginBottom: "1rem" }}>{label}の統計</p>

      {/* サマリー数値 2x2 */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { label: "総アクセス",      value: logs?.length ?? 0 },
          { label: "ボット来訪",      value: data.totalBots },
          { label: "🪤 ハニーポット", value: data.honeypotHits },
          { label: "検出種別数",      value: botEntries.length },
        ].map((item) => (
          <div key={item.label} style={{
            background: "var(--neutral-100)",
            borderRadius: "var(--radius-sm)",
            padding: "0.65rem 0.75rem",
          }}>
            <p style={{ fontSize: "0.68rem", color: "var(--neutral-400)", marginBottom: "0.2rem" }}>
              {item.label}
            </p>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "var(--neutral)" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ボット種別バーグラフ */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>
          ボット種別
        </p>
        {botEntries.length === 0 ? (
          <p style={{ fontSize: "0.8rem", color: "var(--neutral-400)" }}>データなし</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {botEntries.map(([bot, count]) => {
              const pct = Math.round((count / (data.totalBots || 1)) * 100);
              const isAI = /GPTBot|ClaudeBot|Perplexity|Google|Bing|anthropic/i.test(bot);
              return (
                <div key={bot} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    fontSize: "0.72rem",
                    fontFamily: "'DM Mono', monospace",
                    width: "120px",
                    flexShrink: 0,
                    color: isAI ? "var(--primary)" : "var(--neutral-600)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {bot}
                  </span>
                  <div style={{ flex: 1, background: "var(--border)", borderRadius: "999px", height: "5px", overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: isAI ? "var(--primary)" : "var(--neutral-400)",
                      borderRadius: "999px",
                    }} />
                  </div>
                  <span style={{ fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", color: "var(--neutral-400)", width: "24px", textAlign: "right", flexShrink: 0 }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ASN別訪問数 */}
      <div>
        <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>
          ASN別訪問数
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {asnEntries.map(([asn, count]) => {
            const info = ASN_LABELS[asn];
            const color = info ? typeColor[info.type] : "var(--neutral-400)";
            return (
              <div key={asn} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--neutral-400)", width: "46px", flexShrink: 0 }}>
                  {asn}
                </span>
                <span style={{ flex: 1, color, fontWeight: info ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {info ? info.name : "Unknown"}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--neutral-600)", fontWeight: 600, flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ========================================
// ページ本体
// ========================================
export default async function StatsPage() {
  const weekStart  = getWeekStart();
  const monthStart = getMonthStart();

  const { data: monthLogs } = await supabaseAdmin
    .from("access_logs")
    .select("created_at, bot_type, is_honeypot, asn, path")
    .gte("created_at", monthStart)
    .order("created_at", { ascending: false });

  const { data: weekLogs } = await supabaseAdmin
    .from("access_logs")
    .select("created_at, bot_type, is_honeypot, asn, path")
    .gte("created_at", weekStart)
    .order("created_at", { ascending: false });

  const month = calcStats((monthLogs as LogRow[]) || []);
  const week  = calcStats((weekLogs  as LogRow[]) || []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "GEO Lab AIクローラー観測レポート",
    description: "AIクローラーの来訪頻度・ASN分布・ハニーポット踏破率の公開観測データ",
    url: PAGE_URL,
    creator: { "@type": "Organization", name: "GEO Lab" },
    dateModified: new Date().toISOString(),
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* ページヘッダー */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--accent)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-sm)",
      }}>
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>Live Observatory</p>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>観測レポート</h1>
        <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>
          GEO Lab に来訪したAIクローラーの集計データを公開しています。
          生のアクセスログは非公開。集計値のみ開示。
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--neutral-400)", marginTop: "0.6rem" }}>
          最終更新: {new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
        </p>
      </div>

      {/* 今週・今月 — SP: 縦1列 / MD以上: 横2列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <StatsPanel label="今週" data={week}  logs={(weekLogs  as LogRow[]) || []} />
        <StatsPanel label="今月" data={month} logs={(monthLogs as LogRow[]) || []} />
      </div>

      {/* 注意事項 */}
      <div style={{
        background: "var(--primary-light)",
        border: "1.5px solid #BFDBFE",
        borderLeft: "4px solid var(--primary)",
        borderRadius: "var(--radius-sm)",
        padding: "1rem 1.25rem",
        fontSize: "0.85rem",
        color: "var(--neutral-800)",
        lineHeight: 1.7,
      }}>
        <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>観測の注意事項</p>
        <p>
          このデータはAIクローラーが「来訪した」ことを示すものであり、
          コンテンツが生成AIの回答に「引用された」ことを示すものではありません。
          クロール ≠ 引用。この違いがGEO観測の核心的な限界です。
        </p>
      </div>
    </div>
  );
}
