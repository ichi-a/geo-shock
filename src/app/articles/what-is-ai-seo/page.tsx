// 場所: src/app/articles/what-is-ai-seo/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Disclaimer } from "@/components/Disclaimer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/articles/what-is-ai-seo`;

export const metadata: Metadata = {
  title: "AI SEOとは — AI時代の検索最適化戦略",
  description: "AI SEOとは、AIを活用したSEO効率化と、AI検索（生成AI）に引用されるためのコンテンツ最適化の両方を含む概念。GEO・AEO・AIOとの関係も解説。",
  alternates: { canonical: PAGE_URL },
};

const RELATED = [
  { href: "/articles/what-is-geo",       label: "GEOとは" },
  { href: "/articles/what-is-aio",       label: "AIOとは" },
  { href: "/articles/what-is-aeo",       label: "AEOとは" },
  { href: "/articles/what-is-ai-search", label: "AI検索最適化とは" },
];

export default function WhatIsAiSeoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI SEOとは — AI時代の検索最適化戦略",
    description: "AI SEOとは、AIを活用したSEO効率化とAI検索への最適化の両方を含む概念。",
    url: PAGE_URL,
    datePublished: "2026-02-23",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mainEntity: {
      "@type": "DefinedTerm",
      name: "AI SEO",
      description: "AIを活用したSEO作業の効率化と、AI検索エンジンに引用されるためのコンテンツ最適化の両方を含む概念。",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AI SEOとGEOの違いは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI SEOは「AIを使ったSEO」と「AI向けのSEO」の両方を含む広義の概念です。GEOはその中の「生成AIエンジンへの最適化」に特化した概念です。AI SEOはGEO・AIO・AEOを包括する上位概念と捉えることができます。",
        },
      },
      {
        "@type": "Question",
        name: "AI SEOを始めるにはどこから手をつければよいですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "まず既存コンテンツへのJSON-LD構造化データの実装と、FAQ形式のコンテンツ追加から始めるのが効率的です。次にAIに直接質問して自社コンテンツが引用されるかを定期観測する習慣をつけましょう。",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />

      <article style={{ maxWidth: "680px" }}>
        <div className="experiment-tag-bar">
          <span style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>関連概念:</span>
          {RELATED.map((r) => (
            <a key={r.href} href={r.href} style={{ fontSize: "0.78rem", color: "var(--primary)", textDecoration: "underline" }}>{r.label}</a>
          ))}
        </div>

        <h1>AI SEOとは<br /><span style={{ fontSize: "1.1rem", fontWeight: 400, color: "var(--neutral-600)" }}>AI時代の検索最適化戦略</span></h1>

        <div className="definition-box">
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>定義</p>
          <p style={{ lineHeight: 1.8 }}>
            <strong>AI SEO</strong>とは、①AIツールを活用してSEO作業を効率化する「AIによるSEO」と、②ChatGPTやPerplexityなどのAI検索エンジンに引用される「AI向けのSEO」の両方を含む概念の総称。広義には<a href="/articles/what-is-geo" style={{ color: "var(--primary)" }}>GEO</a>・<a href="/articles/what-is-aio" style={{ color: "var(--primary)" }}>AIO</a>・<a href="/articles/what-is-aeo" style={{ color: "var(--primary)" }}>AEO</a>を包括する上位概念として使われることが多い。
          </p>
        </div>

        <h2>AI SEOの2つの側面</h2>
        <p>
          AI SEOという言葉は、文脈によって2つの異なる意味で使われる。この2つを区別して理解することが重要だ。
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1.25rem 0" }} className="grid grid-cols-1 sm:grid-cols-2">
          <div style={{ background: "var(--primary-light)", border: "1.5px solid #BFDBFE", borderRadius: "var(--radius-sm)", padding: "1.25rem" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--primary)", marginBottom: "0.5rem" }}>SIDE A</p>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>AIを使ったSEO</p>
            <p style={{ fontSize: "0.85rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>
              AIツールでキーワード調査・構成案・コンテンツ生成・競合分析を効率化する。作業速度と網羅性を高めるための手段としてAIを活用する。
            </p>
          </div>
          <div style={{ background: "var(--accent-light)", border: "1.5px solid #99F6E4", borderRadius: "var(--radius-sm)", padding: "1.25rem" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#0F766E", marginBottom: "0.5rem" }}>SIDE B</p>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>AI向けのSEO</p>
            <p style={{ fontSize: "0.85rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>
              ChatGPT・Perplexity・Google AI OverviewsなどのAI検索に回答の一部として引用されるようコンテンツを最適化する。GEO・AIO・AEOと同義。
            </p>
          </div>
        </div>

        <h2>従来のSEOとの比較</h2>
        <table>
          <thead>
            <tr>
              <th>観点</th>
              <th>従来のSEO</th>
              <th>AI SEO（AI向け）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>最適化対象</td>
              <td>Googleの検索アルゴリズム</td>
              <td>AI生成回答エンジン</td>
            </tr>
            <tr>
              <td>成果指標</td>
              <td>検索順位・クリック数</td>
              <td>AI回答への引用率</td>
            </tr>
            <tr>
              <td>コンテンツ設計</td>
              <td>キーワード密度・被リンク数</td>
              <td>構造化・一次情報・信頼性</td>
            </tr>
            <tr>
              <td>重視する要素</td>
              <td>ページランク・権威性</td>
              <td>E-E-A-T・JSON-LD・FAQ構造</td>
            </tr>
          </tbody>
        </table>

        <h2>AI SEOで求められるコンテンツの条件</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", margin: "1.25rem 0" }}>
          {[
            "質問に対して冒頭で明確に答えている（結論ファースト）",
            "他サイトにない独自のデータ・観測結果・一次情報を含む",
            "JSON-LDで構造化されており、AIがコンテンツを正確に解釈できる",
            "著者・組織の専門性・信頼性が明示されている",
            "関連するトピックを網羅的にカバーしている",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem" }}>
              <span style={{ width: "20px", height: "20px", background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>
                {i + 1}
              </span>
              <p style={{ color: "var(--neutral-800)", lineHeight: 1.65 }}>{item}</p>
            </div>
          ))}
        </div>

        <h2>よくある質問</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { q: "AI SEOとGEOの違いは何ですか？", a: "AI SEOは「AIを使ったSEO」と「AI向けのSEO」の両方を含む広義の概念です。GEOはその中の「生成AIエンジンへの最適化」に特化した概念です。AI SEOはGEO・AIO・AEOを包括する上位概念と捉えることができます。" },
            { q: "AI SEOを始めるにはどこから手をつければよいですか？", a: "まず既存コンテンツへのJSON-LD構造化データの実装と、FAQ形式のコンテンツ追加から始めるのが効率的です。次にAIに直接質問して自社コンテンツが引用されるかを定期観測する習慣をつけましょう。" },
          ].map((item) => (
            <div key={item.q} style={{ background: "var(--neutral-100)", borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.4rem" }}>Q. {item.q}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>A. {item.a}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--neutral-400)" }}>
          <p>公開日: 2026-02-23 / GEO Lab</p>
          <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <span>関連:</span>
            {RELATED.map((r) => (
              <a key={r.href} href={r.href} style={{ color: "var(--primary)", textDecoration: "underline" }}>{r.label}</a>
            ))}
          </div>
        </div>
        <Disclaimer />
      </article>
    </>
  );
}
