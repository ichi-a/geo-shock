// 場所: src/app/articles/what-is-geo/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Disclaimer } from "@/components/Disclaimer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/articles/what-is-geo`;

export const metadata: Metadata = {
  title: "GEO（生成エンジン最適化）とは何か",
  description:
    "GEO（Generative Engine Optimization）とは、ChatGPTやPerplexityなどの生成AIに自社コンテンツを引用させるための最適化手法。AIO・AEO・AI SEOとの関係も解説。",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "GEO（生成エンジン最適化）とは何か",
    url: PAGE_URL,
    type: "article",
  },
};

const SYNONYMS = [
  { href: "/articles/what-is-aio",       label: "AIO（AI Optimization）" },
  { href: "/articles/what-is-aeo",       label: "AEO（Answer Engine Optimization）" },
  { href: "/articles/what-is-ai-seo",    label: "AI SEO" },
  { href: "/articles/what-is-ai-search", label: "AI検索最適化" },
];

export default function WhatIsGeoPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${PAGE_URL}#article`,
    headline: "GEO（生成エンジン最適化）とは何か",
    description:
      "GEO（Generative Engine Optimization）とは、ChatGPTやPerplexityなど生成AIの回答に自社コンテンツを引用させるための最適化手法。",
    url: PAGE_URL,
    datePublished: "2025-01-01",
    dateModified: "2026-02-23",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    about: {
      "@type": "DefinedTerm",
      name: "GEO",
      alternateName: ["Generative Engine Optimization", "生成エンジン最適化", "AIO", "AEO", "AI SEO"],
      description:
        "ChatGPT・Perplexity・Google AI Overviewsなどの生成AIが回答を構成する際に、自社コンテンツが引用・推薦されるよう最適化する手法。",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "GEOとSEOの違いは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SEOは検索エンジンの順位を上げてクリックを獲得することを目的とします。GEOはAIが生成する回答に引用されることを目的とし、クリックではなく「AIによる言及」を成果指標とします。",
        },
      },
      {
        "@type": "Question",
        name: "GEOとAEO・AIOは同じですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "実質的にほぼ同義です。AEO（Answer Engine Optimization）は回答エンジンへの最適化、AIO（AI Optimization）はAI Overviews対策に焦点を当てた用語ですが、対策内容はGEOと大きく重なります。GEO Labでは生成エンジン全般への最適化という意味でGEOという用語を使用しています。",
        },
      },
      {
        "@type": "Question",
        name: "GEO対策で最も効果的なことは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JSON-LDによる構造化データの実装と、一次情報・独自データを含む明確な記述が最も効果的とされています。GEO Labの実験でも、JSON-LDの有無がAIクローラーの来訪頻度に影響することが示唆されています。",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />

      <article style={{ maxWidth: "680px" }}>
        {/* 実験ラベル */}
        <div className="experiment-tag-bar">
          <span className="badge badge-primary">GEO特化型</span>
          <span style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>JSON-LDあり・構造化記述・結論ファースト</span>
        </div>

        <h1>GEO（生成エンジン最適化）とは何か</h1>

        {/* 定義ボックス */}
        <div className="definition-box">
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            定義
          </p>
          <p style={{ lineHeight: 1.8 }}>
            <strong>GEO（Generative Engine Optimization、生成エンジン最適化）</strong>とは、
            ChatGPT・Perplexity・Google AI OverviewsなどのAIが回答を構成する際に、
            自社コンテンツが引用・推薦されるよう最適化する手法。
            従来のSEOが「検索結果の順位」を追求するのに対し、
            GEOは「AIの回答への引用」を成果指標とする。
          </p>
        </div>

        <h2>なぜGEOが必要か</h2>
        <p>
          ユーザーの情報収集行動が変化している。かつて「Google検索 → リンクをクリック → サイトで情報を読む」というフローが主流だったが、現在は「AIに質問 → AIが直接回答」という形が急速に普及している。
        </p>
        <p>
          この変化はWebサイト運営者にとって深刻な問題を引き起こす。SEOで検索1位を獲得しても、AI検索がゼロクリック回答を提供すれば流入は得られない。GEOはこの課題に対応するための戦略的フレームワークだ。
        </p>

        <h2>GEOの主な対策</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0" }}>
          {[
            { title: "JSON-LDによる構造化データの実装", body: "AIがコンテンツの内容・文脈・著者を正確に理解できるよう、Schema.orgに基づく構造化データを実装する。GEO Labの実験では、JSON-LDの有無がAIクローラーの来訪頻度に影響することが示唆されている。" },
            { title: "結論ファーストの記述構造", body: "AIは記事冒頭の情報を回答に組み込みやすい。ページの冒頭で定義・結論を明示し、その後で詳細・根拠を展開するパターンが有効とされる。" },
            { title: "一次情報・独自データの提供", body: "他サイトにない独自の観測データ・実験結果・専門的見解を提供することで、AIにとって「引用する価値がある情報源」として評価される可能性が高まる。" },
            { title: "FAQPage・DefinedTermスキーマの活用", body: "よくある質問と回答を構造化することで、AIが特定の問いに対する答えとして採用しやすくなる。造語の定義にはDefinedTermスキーマが特に有効。" },
          ].map((item) => (
            <div key={item.title} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--primary)",
              borderRadius: "var(--radius-sm)",
              padding: "1rem 1.25rem",
            }}>
              <p style={{ fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>{item.title}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* 類義語セクション */}
        <div style={{
          background: "var(--neutral-100)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "1.25rem 1.5rem",
          margin: "2rem 0",
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
            類義語 / 関連概念
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--neutral-600)", marginBottom: "0.75rem", lineHeight: 1.65 }}>
            GEOはさまざまな呼び方で知られている。いずれも「AIの回答に引用されること」を目標とする点では共通している。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {SYNONYMS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  border: "1px solid #BFDBFE",
                  borderRadius: "999px",
                  padding: "0.3em 0.8em",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.15s ease",
                }}
              >
                {s.label} →
              </a>
            ))}
          </div>
        </div>

        <h2>GEOとSEOの比較</h2>
        <table>
          <thead>
            <tr>
              <th>観点</th>
              <th>SEO</th>
              <th>GEO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>最適化対象</td>
              <td>Google検索アルゴリズム</td>
              <td>生成AIエンジン</td>
            </tr>
            <tr>
              <td>成果指標</td>
              <td>検索順位・クリック数</td>
              <td>AI回答への引用率</td>
            </tr>
            <tr>
              <td>重視する要素</td>
              <td>被リンク数・キーワード密度</td>
              <td>構造化データ・一次情報</td>
            </tr>
            <tr>
              <td>コンテンツ設計</td>
              <td>キーワード最適化</td>
              <td>結論ファースト・FAQ構造</td>
            </tr>
          </tbody>
        </table>

        <h2>よくある質問</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { q: "GEOとSEOの違いは何ですか？", a: "SEOは検索エンジンの順位を上げてクリックを獲得することを目的とします。GEOはAIが生成する回答に引用されることを目的とし、クリックではなく「AIによる言及」を成果指標とします。" },
            { q: "GEOとAEO・AIOは同じですか？", a: "実質的にほぼ同義です。AEO（Answer Engine Optimization）は回答エンジンへの最適化、AIO（AI Optimization）はAI Overviews対策に焦点を当てた用語ですが、対策内容はGEOと大きく重なります。" },
            { q: "GEO対策で最も効果的なことは何ですか？", a: "JSON-LDによる構造化データの実装と、一次情報・独自データを含む明確な記述が最も効果的とされています。GEO Labの実験でも、JSON-LDの有無がAIクローラーの来訪頻度に影響することが示唆されています。" },
          ].map((item) => (
            <div key={item.q} style={{ background: "var(--neutral-100)", borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.4rem" }}>Q. {item.q}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>A. {item.a}</p>
            </div>
          ))}
        </div>

        <div className="observing-banner" style={{ marginTop: "1.5rem" }}>
          GEO Lab はこのサイト自体をGEO実験場として運用中。
          <a href="/experiments" style={{ color: "#92400E", textDecoration: "underline", marginLeft: "0.4rem" }}>実験ログを見る →</a>
        </div>

        <div style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--neutral-400)" }}>
          <p>公開日: 2025-01-01 / 更新日: 2026-02-23 / GEO Lab</p>
          <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <span>類義語:</span>
            {SYNONYMS.map((s) => (
              <a key={s.href} href={s.href} style={{ color: "var(--primary)", textDecoration: "underline" }}>{s.label}</a>
            ))}
          </div>
        </div>
        <Disclaimer />
      </article>
    </>
  );
}
