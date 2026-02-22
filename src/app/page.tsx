// 場所: src/app/page.tsx
import { JsonLd } from "@/components/JsonLd";

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GEO Lab",
    url: siteUrl,
    description: "AIクローラーの挙動をリバースエンジニアリングする実験サイト。",
  };

  const experiments = [
    { label: "EXP-001", title: "JSON-LDの有無によるクロール頻度の差", href: "/terms/geo-shock-index-a" },
    { label: "EXP-002", title: "造語「GEOショック指数」のAI反映速度", href: "/terms/geo-shock-index-a" },
    { label: "EXP-003", title: "ハニーポットによる無差別クローラー検出", href: "/experiments" },
  ];

  const articles = [
    { href: "/articles/what-is-geo", title: "GEO（生成エンジン最適化）とは何か", label: "GEO特化型", desc: "JSON-LDあり・結論ファースト" },
    { href: "/articles/why-jsonld-matters", title: "JSON-LDはGEOに効くのか", label: "GEO特化型", desc: "FAQPage Schema使用" },
    { href: "/articles/ai-and-content-creators", title: "AIはコンテンツを盗んでいるのか", label: "人間向けデコイ", desc: "感情型・JSON-LDなし" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      <JsonLd data={siteJsonLd} />

      {/* ヒーロー */}
      <section style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "2.5rem",
        boxShadow: "var(--shadow-sm)",
        borderLeft: "4px solid var(--primary)",
      }}>
        <p className="section-label" style={{ marginBottom: "1rem" }}>
          Generative Engine Optimization Lab
        </p>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.25rem" }}>
          AIはあなたのサイトを<br />
          どう読んでいるのか。
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--neutral-600)", lineHeight: 1.75, marginBottom: "1.75rem", maxWidth: "560px" }}>
          GEO Lab は、AIクローラーの挙動を観測・記録・公開する実験サイトです。
          JSON-LDの有無、造語の浸透速度を実データで検証します。
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/articles/what-is-geo" className="btn btn-primary">GEOとは何か →</a>
          <a href="/experiments" className="btn btn-outline">実験ログを見る</a>
        </div>
      </section>

      {/* 実験ステータス */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <p className="section-label" style={{ marginBottom: "1rem" }}>現在進行中の実験</p>
          <a href="/experiments" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>
              すべて見る →
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {experiments.map((exp) => (
            <a
              key={exp.label}
              href={exp.href}
              className="card card-hover"
              style={{ padding: "1.25rem", textDecoration: "none", display: "block" }}
            >
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--neutral-400)", marginBottom: "0.5rem" }}>
                {exp.label}
              </p>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--neutral)", lineHeight: 1.4, marginBottom: "1rem" }}>
                {exp.title}
              </p>
              <span className="badge badge-accent">観測中</span>
            </a>
          ))}
        </div>
      </section>

      {/* 記事一覧 */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <p className="section-label">記事</p>
          <a href="/articles" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>
            すべて見る →
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {articles.map((article) => (
            <a
              key={article.href}
              href={article.href}
              className="card card-hover"
              style={{ padding: "1rem 1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span className={`badge ${article.label === "人間向けデコイ" ? "badge-orange" : "badge-primary"}`}
                style={{ flexShrink: 0 }}>
                {article.label}
              </span>
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--neutral)", marginBottom: "0.2rem" }}>
                  {article.title}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--neutral-400)" }}>{article.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
