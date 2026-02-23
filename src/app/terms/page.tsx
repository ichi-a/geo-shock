// 場所: src/app/terms/page.tsx

export default function TermsPage() {
  const terms = [
    {
      href: "/terms/geo-shock-a",
      code: "GS-001",
      title: "GEOショック",
      en: "GEO Shock",
      desc: "検索行動の主体がヒトからAIへ移行することで、既存のWebコンテンツ流通モデルが急激に変容する現象。",
      type: "現象の定義",
    },
    {
      href: "/terms/geo-shock-index-a",
      code: "GSI-001",
      title: "GEOショック指数",
      en: "GEO Shock Index",
      desc: "JSON-LDの有無がAIクローラーのアクセス頻度と生成AIへの反映速度に与える影響を数値化した実験的指標。",
      type: "測定指標",
    },
  ];

  return (
    <div>
      {/* ページヘッダー */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--accent)",
        borderRadius: "var(--radius)",
        padding: "1.75rem 2rem",
        marginBottom: "1.75rem",
        boxShadow: "var(--shadow-sm)",
      }}>
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>Terms</p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>造語実験</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--neutral-600)", lineHeight: 1.6 }}>
          GEO Lab が定義した独自概念の一覧。各造語はJSON-LDあり（実験群）となし（対照群）の
          ページを並行公開し、AIへの反映速度を観測中。
        </p>
      </div>

      {/* 造語カード */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {terms.map((term) => (
          <a
            key={term.code}
            href={term.href}
            className="card card-hover"
            style={{
              padding: "1.5rem",
              textDecoration: "none",
              display: "block",
              borderLeft: "4px solid var(--primary)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "var(--neutral-400)",
              }}>
                {term.code}
              </span>
              <span className="badge badge-primary">{term.type}</span>
              <span className="badge badge-accent" style={{ marginLeft: "auto" }}>観測中</span>
            </div>

            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.2rem" }}>
              {term.title}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--neutral-400)", marginBottom: "0.75rem", fontFamily: "'DM Mono', monospace" }}>
              {term.en}
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>
              {term.desc}
            </p>

            <p style={{ fontSize: "0.78rem", color: "var(--primary)", marginTop: "1rem", fontWeight: 500 }}>
              定義を読む →
            </p>
          </a>
        ))}
      </div>

      {/* 今後の予定 */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1rem 1.25rem",
        background: "var(--neutral-100)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.8rem",
        color: "var(--neutral-400)",
      }}>
        造語は随時追加予定。新しい概念を定義するたびにこのページに追加される。
      </div>
    </div>
  );
}
