// 場所: src/app/experiments/page.tsx
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/experiments`;

export const metadata = {
  title: "実験ログ — GEO Lab",
  description: "GEO Labで進行中の実験一覧と観測状況。",
  alternates: { canonical: PAGE_URL },
};

const experiments = [
  {
    id: "EXP-001",
    title: "JSON-LDの有無によるAIクローラーアクセス頻度の差",
    status: "観測中",
    startDate: "2026-02-22",
    hypothesis: "JSON-LDを配置したページへのAIクローラーの月次アクセス数は、JSON-LDなしページより多い",
    pages: [
      { label: "ページA（JSON-LDあり）", href: "/terms/geo-shock-index-a" },
      { label: "ページB（JSON-LDなし）", href: "/terms/geo-shock-index-b" },
    ],
    metric: "月次クロール回数の差（Δf）",
    result: "観測中 — データ蓄積待ち",
  },
  {
    id: "EXP-002",
    title: "造語「GEOショック指数」の生成AI反映速度",
    status: "観測中",
    startDate: "2026-02-22",
    hypothesis: "独自造語を定義したページがAIクローラーにクロールされた後、生成AIへの質問で定義が返答される",
    pages: [
      { label: "造語定義ページ（JSON-LDあり）", href: "/terms/geo-shock-index-a" },
    ],
    metric: "初回反映までの日数、定義一致度（Δm）",
    result: "観測日: 2026年2月22日　結果: Perplexityが造語「GEOショック指数」の定義を正確に回答。　反映速度: 公開から約1日",
  },
  {
    id: "EXP-003",
    title: "ハニーポットによる偽装ボット・スクレイパー検出",
    status: "観測中",
    startDate: "2026-02-22",
    hypothesis: "正規のAIクローラーはhidden-trapへアクセスしないが、スクレイパーは踏む",
    pages: [
      { label: "/hidden-trap/a1", href: "/hidden-trap/a1" },
      { label: "/hidden-trap/b2", href: "/hidden-trap/b2" },
    ],
    metric: "ハニーポット踏破率とUA別分布",
    result: "観測中",
  },
  {
    id: "EXP-004",
    title: "感情型記事とGEO特化型記事のクロール頻度比較",
    status: "観測中",
    startDate: "2026-02-22",
    hypothesis: "GEO特化型記事の方が感情型デコイ記事よりAIクローラーの訪問頻度が高い",
    pages: [
      { label: "GEO特化型記事", href: "/articles/what-is-geo" },
      { label: "人間向けデコイ記事", href: "/articles/ai-and-content-creators" },
    ],
    metric: "月次クロール回数の差",
    result: "観測中",
  },
  {
    id: "EXP-005",
    title: "造語「GEOショック」の生成AI反映速度",
    status: "観測中",
    startDate: "2026-02-22",
    hypothesis: "GEOショックという概念がJSON-LDで定義されたページがクロールされた後、生成AIへの質問で定義が返答される",
    pages: [
      { label: "ページA（JSON-LDあり）", href: "/terms/geo-shock-a" },
      { label: "ページB（JSON-LDなし）", href: "/terms/geo-shock-b" },
    ],
    metric: "初回反映までの日数、定義一致度",
    result: "観測中",
  },
];

export default function ExperimentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "GEO Lab 実験観測データ",
    description: "AIクローラーの挙動観測、JSON-LDの効果検証、造語の生成AI反映速度を記録した実験データセット。",
    url: PAGE_URL,
    creator: { "@type": "Organization", name: "GEO Lab" },
    dateCreated: "2026-02-22",
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* ページヘッダー */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.75rem 2rem",
        marginBottom: "1.75rem",
        boxShadow: "var(--shadow-sm)",
        borderLeft: "4px solid var(--accent)",
      }}>
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>Experiments</p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>実験ログ</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--neutral-600)", lineHeight: 1.6 }}>
          GEO Lab で進行中の実験一覧。観測データは蓄積次第、各実験ページで公開します。
        </p>
      </div>

      {/* 観測の限界 */}
      <div style={{
        background: "var(--neutral-100)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "1rem 1.25rem",
        marginBottom: "1.75rem",
        fontSize: "0.83rem",
        color: "var(--neutral-600)",
        lineHeight: 1.65,
      }}>
        <strong style={{ color: "var(--neutral)" }}>観測の原則:</strong>{" "}
        観測できないものは追わない。引用回数の正確な計測は不可能（キャッシュ問題）のため、
        クロール頻度・造語の反映有無・ハニーポット踏破率に絞って記録する。
      </div>

      {/* 実験カード */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {experiments.map((exp) => (
          <div key={exp.id} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--neutral-400)", marginBottom: "0.35rem" }}>
                  {exp.id}
                </p>
                <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{exp.title}</h2>
              </div>
              <span className="badge badge-accent" style={{ flexShrink: 0 }}>{exp.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem 1.5rem", fontSize: "0.83rem" }}>
              <div>
                <p style={{ color: "var(--neutral-400)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>仮説</p>
                <p style={{ color: "var(--neutral-800)", lineHeight: 1.6 }}>{exp.hypothesis}</p>
              </div>
              <div>
                <p style={{ color: "var(--neutral-400)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>観測指標</p>
                <p style={{ color: "var(--neutral-800)" }}>{exp.metric}</p>
              </div>
              <div>
                <p style={{ color: "var(--neutral-400)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>現在の状況</p>
                <p style={{ color: "#92400E" }}>{exp.result}</p>
              </div>
              <div>
                <p style={{ color: "var(--neutral-400)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>対象ページ</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {exp.pages.map((p) => (
                    <a key={p.href} href={p.href} style={{ fontSize: "0.78rem", color: "var(--primary)", textDecoration: "underline" }}>
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.72rem", color: "var(--neutral-400)", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
              開始日: {exp.startDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
