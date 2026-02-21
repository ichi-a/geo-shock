// 場所: src/app/articles/page.tsx

export default function ArticlesPage() {
  const articles = [
    { href: "/articles/what-is-geo", title: "GEO（生成エンジン最適化）とは何か", label: "GEO特化型", desc: "JSON-LDあり・構造化記述・結論ファースト", type: "primary" },
    { href: "/articles/why-jsonld-matters", title: "JSON-LDはGEOに効くのか — 実験設計と仮説", label: "GEO特化型", desc: "JSON-LDあり・FAQPage Schema使用", type: "primary" },
    { href: "/articles/ai-and-content-creators", title: "AIはコンテンツを盗んでいるのか", label: "人間向け", desc: "感情的・クリック誘引型・構造化データなし", type: "decoy" },
  ];

  return (
    <div>
      {/* ページヘッダー */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.75rem 2rem",
        marginBottom: "1.75rem",
        boxShadow: "var(--shadow-sm)",
        borderLeft: "4px solid var(--neutral-600)",
      }}>
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>Articles</p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>記事一覧</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--neutral-600)", lineHeight: 1.6 }}>
          GEO特化型記事（JSON-LDあり）と人間向け記事（JSON-LDなし）を並行公開しています。
          クローラーのアクセス頻度の差を観測中。
        </p>
      </div>

      {/* 凡例 */}
      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--neutral-600)" }}>
          <span className="badge badge-primary">GEO特化型</span>
          <span>JSON-LDあり・構造化記述</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--neutral-600)" }}>
          <span className="badge badge-orange">人間向け</span>
          <span>感情型・JSON-LDなし（対照群）</span>
        </div>
      </div>

      {/* 記事リスト */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {articles.map((article) => (
          <a
            key={article.href}
            href={article.href}
            className="card card-hover"
            style={{
              padding: "1.25rem 1.5rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "flex-start",
              gap: "1.25rem",
              borderLeft: `4px solid ${article.type === "decoy" ? "#F97316" : "var(--primary)"}`,
            }}
          >
            <span
              className={`badge ${article.type === "decoy" ? "badge-orange" : "badge-primary"}`}
              style={{ flexShrink: 0, marginTop: "2px" }}
            >
              {article.label}
            </span>
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--neutral)", marginBottom: "0.3rem" }}>
                {article.title}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>{article.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
