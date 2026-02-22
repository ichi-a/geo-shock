// 場所: src/app/stats/page.tsx
// 公開観測レポート。生ログは見せずに集計データのみ公開。

import { supabaseAdmin } from "@/lib/supabase";
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com"}/stats`;



export const metadata = {
  title: "観測レポート — GEO Lab",
  description: "GEO Lab のAIクローラー観測データを公開。今月・今週の来訪ボット数・ASN別訪問数をリアルタイムで集計。",
  alternates: { canonical: PAGE_URL },
};

export const dynamic = "force-dynamic";

// 既知ASNの組織名マップ
const ASN_LABELS: Record<string, { name: string; type: "ai" | "cloud" | "scraper" | "other" }> = {
  "15169":  { name: "Google",         type: "ai" },
  "16509":  { name: "Amazon / AWS",   type: "cloud" },
  "14618":  { name: "Amazon / AWS",   type: "cloud" },
  "8075":   { name: "Microsoft",      type: "ai" },
  "13335":  { name: "Cloudflare",     type: "cloud" },
  "14061":  { name: "DigitalOcean",   type: "cloud" },
  "24940":  { name: "Hetzner",        type: "cloud" },
  "16276":  { name: "OVH",            type: "cloud" },
  "9009":   { name: "M247",           type: "scraper" },
  "132203": { name: "Tencent Cloud",  type: "scraper" },
  "396982": { name: "Google Cloud",   type: "cloud" },
  "63949":  { name: "Linode",         type: "cloud" },
  "45102":  { name: "Alibaba Cloud",  type: "cloud" },
  "3257":   { name: "GTT",            type: "other" },
  "174":    { name: "Cogent",         type: "other" },
  "2516":   { name: "KDDI",           type: "other" },
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
    // ボット集計
    const bot = log.bot_type || "Human/Unknown";
    botCounts[bot] = (botCounts[bot] || 0) + 1;
    if (log.bot_type) totalBots++;

    // ASN集計
    if (log.asn) {
      asnCounts[log.asn] = (asnCounts[log.asn] || 0) + 1;
    }

    // ハニーポット
    if (log.is_honeypot) honeypotHits++;
  }

  return { botCounts, asnCounts, honeypotHits, totalBots };
}

export default async function StatsPage() {
  const weekStart  = getWeekStart();
  const monthStart = getMonthStart();


  // 今月のデータ
  const { data: monthLogs } = await supabaseAdmin
    .from("access_logs")
    .select("created_at, bot_type, is_honeypot, asn, path")
    .gte("created_at", monthStart)
    .order("created_at", { ascending: false });

  // 今週のデータ
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
        padding: "1.75rem 2rem",
        marginBottom: "2rem",
        boxShadow: "var(--shadow-sm)",
      }}>
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>Live Observatory</p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>観測レポート</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--neutral-600)", lineHeight: 1.6 }}>
          GEO Lab に来訪したAIクローラーの集計データをリアルタイムで公開しています。
          生のアクセスログは非公開。集計値のみ開示。
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--neutral-400)", marginTop: "0.75rem" }}>
          最終更新: {new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
        </p>
      </div>

      {/* 今週 / 今月 並列表示 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {[
          { label: "今週", data: week, logs: weekLogs as LogRow[] },
          { label: "今月", data: month, logs: monthLogs as LogRow[] },
        ].map(({ label, data, logs }) => (
          <div key={label} className="card" style={{ padding: "1.5rem" }}>
            <p className="section-label" style={{ marginBottom: "1rem" }}>{label}の統計</p>

            {/* サマリー数値 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { label: "総アクセス", value: logs?.length ?? 0 },
                { label: "ボット来訪", value: data.totalBots },
                { label: "ハニーポット踏破", value: data.honeypotHits },
                { label: "検出ボット種別", value: Object.keys(data.botCounts).filter(k => k !== "Human/Unknown").length },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "var(--neutral-100)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.75rem 1rem",
                }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--neutral-400)", marginBottom: "0.25rem" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "var(--neutral)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ボット種別内訳 */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.6rem" }}>
                ボット種別
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {Object.entries(data.botCounts)
                  .filter(([k]) => k !== "Human/Unknown")
                  .sort(([, a], [, b]) => b - a)
                  .map(([bot, count]) => {
                    const total = data.totalBots || 1;
                    const pct = Math.round((count / total) * 100);
                    const isAI = /GPTBot|ClaudeBot|Perplexity|Google|Bing|anthropic/i.test(bot);
                    return (
                      <div key={bot} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{ fontSize: "0.75rem", fontFamily: "'DM Mono', monospace", width: "140px", flexShrink: 0, color: isAI ? "var(--primary)" : "var(--neutral-600)" }}>
                          {bot}
                        </span>
                        <div style={{ flex: 1, background: "var(--border)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                          <div style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: isAI ? "var(--primary)" : "var(--neutral-400)",
                            borderRadius: "999px",
                          }} />
                        </div>
                        <span style={{ fontSize: "0.72rem", fontFamily: "'DM Mono', monospace", color: "var(--neutral-400)", width: "30px", textAlign: "right" }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                {Object.keys(data.botCounts).filter(k => k !== "Human/Unknown").length === 0 && (
                  <p style={{ fontSize: "0.8rem", color: "var(--neutral-400)" }}>データなし</p>
                )}
              </div>
            </div>

            {/* ASN別訪問数 */}
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.6rem" }}>
                ASN別訪問数
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {Object.entries(data.asnCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([asn, count]) => {
                    const info = ASN_LABELS[asn];
                    const typeColor: Record<string, string> = {
                      ai:      "var(--primary)",
                      cloud:   "var(--accent)",
                      scraper: "#DC2626",
                      other:   "var(--neutral-400)",
                    };
                    const color = info ? typeColor[info.type] : "var(--neutral-400)";
                    return (
                      <div key={asn} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--neutral-400)", width: "50px", flexShrink: 0 }}>
                          {asn}
                        </span>
                        <span style={{ flex: 1, color, fontWeight: info ? 500 : 400 }}>
                          {info ? info.name : "Unknown"}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--neutral-600)", fontWeight: 600 }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 実験との対応 */}
      <div style={{
        background: "var(--primary-light)",
        border: "1.5px solid #BFDBFE",
        borderLeft: "4px solid var(--primary)",
        borderRadius: "var(--radius-sm)",
        padding: "1.25rem 1.5rem",
        fontSize: "0.875rem",
        color: "var(--neutral-800)",
        lineHeight: 1.7,
      }}>
        <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>観測の注意事項</p>
        <p>
          このデータはAIクローラーが「来訪した」ことを示すものであり、
          コンテンツが生成AIの回答に「引用された」ことを示すものではありません。
        </p>
      </div>
    </div>
  );
}
