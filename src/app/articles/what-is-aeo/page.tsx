// 場所: src/app/articles/what-is-aeo/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Disclaimer } from "@/components/Disclaimer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/articles/what-is-aeo`;

export const metadata: Metadata = {
  title: "AEOとは — Answer Engine Optimization（回答エンジン最適化）",
  description: "AEO（Answer Engine Optimization）とは、ChatGPT・Perplexity・Google AI OverviewsなどのAIが回答を生成する際に自社コンテンツを採用させるための最適化手法。",
  alternates: { canonical: PAGE_URL },
};

const RELATED = [
  { href: "/articles/what-is-geo",       label: "GEOとは" },
  { href: "/articles/what-is-aio",       label: "AIOとは" },
  { href: "/articles/what-is-ai-seo",    label: "AI SEOとは" },
  { href: "/articles/what-is-ai-search", label: "AI検索最適化とは" },
];

export default function WhatIsAeoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AEOとは — Answer Engine Optimization（回答エンジン最適化）",
    description: "AEO（Answer Engine Optimization）とは、AIが回答を生成する際に自社コンテンツを採用させるための最適化手法。",
    url: PAGE_URL,
    datePublished: "2026-02-23",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mainEntity: {
      "@type": "DefinedTerm",
      name: "AEO",
      alternateName: "Answer Engine Optimization",
      description: "ChatGPT・Perplexity・Google AI OverviewsなどのAIが回答を生成する際に自社コンテンツが採用されるよう最適化する手法。",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AEOとGEOの違いは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AEOは「回答エンジン」全般への最適化を指し、GEOは「生成エンジン（Generative Engine）」への最適化を指します。対象が若干異なりますが、実質的な対策内容はほぼ重なります。どちらもAIに引用される情報源になることを目指す概念です。",
        },
      },
      {
        "@type": "Question",
        name: "AEO対策で最も重要なことは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AIが「信頼できる情報源」と判断できる根拠を提示することです。具体的には一次データの公開、著者の専門性の明示、構造化データの実装、そして質問に対して明確かつ端的に答えるコンテンツ設計が重要です。",
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

        <h1>AEOとは<br /><span style={{ fontSize: "1.1rem", fontWeight: 400, color: "var(--neutral-600)" }}>Answer Engine Optimization（回答エンジン最適化）</span></h1>

        <div className="definition-box">
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>定義</p>
          <p style={{ lineHeight: 1.8 }}>
            <strong>AEO（Answer Engine Optimization）</strong>とは、ChatGPT・Perplexity・Google AI OverviewsなどのAIが質問に対して回答を生成する際、自社のコンテンツが回答の構成要素として採用されるよう最適化する手法。従来のSEOが「サイトへの誘導」を目的とするのに対し、AEOは「AIの回答内での言及・引用」を目的とする。
          </p>
        </div>

        <h2>「回答エンジン」とは何か</h2>
        <p>
          かつて情報収集の主役だった検索エンジンは「関連するWebページを一覧表示する」ものだった。ユーザーはその中から適切なページを選んでクリックし、自分で情報を読み取っていた。
        </p>
        <p>
          現在登場している「回答エンジン」は異なる。ユーザーの質問に対してAIが直接答えを生成して提示する。Perplexity・ChatGPT Search・Google AI Overviewsがその代表例だ。このシフトにより、情報発信者にとって重要な問いは「検索に引っかかるか」から「AIの回答に採用されるか」へと変化した。
        </p>

        <h2>AEOの対策内容</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0" }}>
          {[
            { title: "明確な問いと答えの構造", body: "AIは「問いに対して端的に答えているコンテンツ」を採用しやすい。記事の冒頭で結論を述べ、FAQセクションを設けることが基本的な対策となる。" },
            { title: "信頼性の可視化（E-E-A-T）", body: "AIは情報の信頼性を評価する。著者の専門的背景の明示、一次情報・独自データの提供、外部からの引用・言及の獲得が信頼性向上につながる。" },
            { title: "構造化データの実装", body: "FAQPage・HowTo・DefinedTermなどのSchema.orgスキーマを実装することで、AIがコンテンツの内容と文脈を正確に把握しやすくなる。" },
            { title: "網羅的なトピックカバレッジ", body: "単一キーワードではなく、あるトピックに関連する疑問を体系的に網羅したコンテンツは、AIにとって「包括的な情報源」として評価されやすい。" },
          ].map((item) => (
            <div key={item.title} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              borderRadius: "var(--radius-sm)",
              padding: "1rem 1.25rem",
            }}>
              <p style={{ fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>{item.title}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>{item.body}</p>
            </div>
          ))}
        </div>

        <h2>AEOとGEO・AIOの関係</h2>
        <p>
          AEO・GEO・AIOは異なる文脈から生まれた用語だが、目指す方向性は同じだ。いずれも「AIに引用される情報源になること」を目標とする。GEO Labでは「生成エンジン全般への最適化」という意味でGEOという用語を主に使用しているが、AEOはその同義語・類義語として捉えている。
        </p>

        <table>
          <thead>
            <tr>
              <th>用語</th>
              <th>提唱背景</th>
              <th>フォーカス</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GEO</td>
              <td>学術研究（2023年〜）</td>
              <td>生成AIエンジン全般</td>
            </tr>
            <tr>
              <td><strong>AEO</strong></td>
              <td>マーケティング業界</td>
              <td>回答エンジンへの採用</td>
            </tr>
            <tr>
              <td>AIO</td>
              <td>Google AI Overviews対策</td>
              <td>AI Overviewsでの引用</td>
            </tr>
          </tbody>
        </table>

        <h2>よくある質問</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { q: "AEOとGEOの違いは何ですか？", a: "AEOは「回答エンジン」全般への最適化、GEOは「生成エンジン」への最適化を指します。対象が若干異なりますが対策内容はほぼ重なります。どちらもAIに引用される情報源になることを目指す概念です。" },
            { q: "AEO対策で最も重要なことは何ですか？", a: "AIが「信頼できる情報源」と判断できる根拠を提示することです。一次データの公開、著者の専門性の明示、構造化データの実装、そして質問に明確に答えるコンテンツ設計が重要です。" },
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
