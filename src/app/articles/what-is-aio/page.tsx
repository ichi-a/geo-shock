// 場所: src/app/articles/what-is-aio/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Disclaimer } from "@/components/Disclaimer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/articles/what-is-aio`;

export const metadata: Metadata = {
  title: "AIOとは — AI Optimization（AI最適化）の基本",
  description: "AIO（AI Optimization）とは、GoogleのAI OverviewsやChatGPTなど生成AIの回答に自社コンテンツを引用させるための最適化手法。GEO・AEOとの違いも解説。",
  alternates: { canonical: PAGE_URL },
};

const RELATED = [
  { href: "/articles/what-is-geo",       label: "GEO（生成エンジン最適化）とは" },
  { href: "/articles/what-is-aeo",       label: "AEOとは" },
  { href: "/articles/what-is-ai-seo",    label: "AI SEOとは" },
  { href: "/articles/what-is-ai-search", label: "AI検索最適化とは" },
];

export default function WhatIsAioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AIOとは — AI Optimization（AI最適化）の基本",
    description: "AIO（AI Optimization）とは、生成AIの回答に自社コンテンツを引用させるための最適化手法。",
    url: PAGE_URL,
    datePublished: "2026-02-23",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mainEntity: {
      "@type": "DefinedTerm",
      name: "AIO",
      alternateName: "AI Optimization",
      description: "GoogleのAI OverviewsやChatGPTなど生成AIの回答で自社コンテンツが引用されるよう最適化する手法。",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AIOとSEOの違いは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SEOは検索結果での順位を上げてクリックを獲得することを目的とします。AIOはAIが回答を生成する際に自社コンテンツを引用させることを目的とし、クリックではなく「引用」を成果指標とします。",
        },
      },
      {
        "@type": "Question",
        name: "AIOの具体的な対策方法は？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JSON-LDによる構造化データの実装、質問と答えが明確なFAQ形式のコンテンツ、一次情報に基づく独自性のある記述、E-E-A-Tを意識した専門性の提示が主な対策です。",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />

      <article style={{ maxWidth: "680px" }}>
        {/* 類義語バー */}
        <div className="experiment-tag-bar">
          <span style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>関連概念:</span>
          {RELATED.map((r) => (
            <a key={r.href} href={r.href} style={{ fontSize: "0.78rem", color: "var(--primary)", textDecoration: "underline" }}>
              {r.label}
            </a>
          ))}
        </div>

        <h1>AIOとは<br /><span style={{ fontSize: "1.1rem", fontWeight: 400, color: "var(--neutral-600)" }}>AI Optimization（AI最適化）</span></h1>

        {/* 定義ボックス */}
        <div className="definition-box">
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>定義</p>
          <p style={{ lineHeight: 1.8 }}>
            <strong>AIO（AI Optimization）</strong>とは、GoogleのAI Overviewsや ChatGPT・Perplexityなどの生成AI検索において、自社のコンテンツが回答の一部として引用・推薦されるよう最適化する手法。従来のSEOが「クリック数・検索順位」を指標とするのに対し、AIOは「AIによる引用回数・言及品質」を成果指標とする。
          </p>
        </div>

        <h2>なぜAIOが注目されるのか</h2>
        <p>
          ユーザーが検索エンジンに直接答えを求める行動が一般化したことで、検索結果の1位に表示されてもクリックされない「ゼロクリック検索」が増加している。GoogleのAI Overviews、Perplexity、ChatGPT Searchなどが回答を直接提示するようになった現在、Webサイトへの流入を確保するためには「検索に引っかかる」だけでなく「AIに引用される」ことが求められるようになってきた。
        </p>
        <p>
          AIOはこの変化に対応するための概念として生まれた。コンテンツをAIが「有益な一次情報源」として認識できる形に整えることが、AIO対策の核心となる。
        </p>

        <h2>AIOの主な対策</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0" }}>
          {[
            { title: "構造化データ（JSON-LD）の実装", body: "AIがコンテンツの内容・文脈・著者を正確に理解できるよう、Schema.orgに基づいた構造化データを実装する。Article・FAQPage・DefinedTermなどのスキーマが特に有効とされる。" },
            { title: "質問-回答形式のコンテンツ設計", body: "AIは「問いに対する明確な答え」を持つコンテンツを引用しやすい。FAQセクションを設け、ユーザーが実際に検索する質問文とその答えを明示する。" },
            { title: "一次情報・独自データの提供", body: "他サイトにない独自の観測データ・実験結果・専門的な見解を提供することで、AIにとって「引用する価値がある情報源」として評価される。" },
            { title: "E-E-A-Tの強化", body: "Experience（経験）・Expertise（専門性）・Authoritativeness（権威性）・Trust（信頼性）を高めることで、AIが情報の信頼度を判断する際に有利に働く。" },
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

        <h2>SEO・GEO・AEOとの違い</h2>
        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>目的</th>
              <th>成果指標</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="/articles/what-is-geo" style={{ color: "var(--primary)" }}>GEO</a></td>
              <td>生成エンジン全般での引用最適化</td>
              <td>AI回答への反映率</td>
            </tr>
            <tr>
              <td><strong>AIO</strong></td>
              <td>AI Overviews等でのブランド引用</td>
              <td>AI引用回数・言及品質</td>
            </tr>
            <tr>
              <td><a href="/articles/what-is-aeo" style={{ color: "var(--primary)" }}>AEO</a></td>
              <td>回答エンジンへの最適化</td>
              <td>回答内での採用率</td>
            </tr>
            <tr>
              <td>SEO</td>
              <td>検索順位の向上</td>
              <td>クリック数・順位</td>
            </tr>
          </tbody>
        </table>

        <h2>よくある質問</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { q: "AIOとSEOは両立できますか？", a: "両立できる。むしろSEOの基本（適切なHTML构造・高品質なコンテンツ・信頼性の確保）はAIOの基盤にもなる。AIOはSEOの代替ではなく、AI時代における拡張と捉えるのが適切。" },
            { q: "AIOの効果はどう計測しますか？", a: "AIに特定のキーワードを質問し、自社コンテンツが引用されるかどうかを定期的に観測する方法が現状では主流。GEO Labもこの手法で実験を行っている。" },
          ].map((item) => (
            <div key={item.q} style={{ background: "var(--neutral-100)", borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.4rem", color: "var(--neutral)" }}>Q. {item.q}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>A. {item.a}</p>
            </div>
          ))}
        </div>

        {/* フッター */}
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
