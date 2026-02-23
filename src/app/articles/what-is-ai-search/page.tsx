// 場所: src/app/articles/what-is-ai-search/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Disclaimer } from "@/components/Disclaimer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/articles/what-is-ai-search`;

export const metadata: Metadata = {
  title: "AI検索・AI検索最適化とは — 生成AI時代の情報収集の変化",
  description: "AI検索とは、ChatGPT・Perplexity・Google AI OverviewsなどのAIが直接回答を生成する新しい検索形態。AI検索最適化（GEO/AEO）の基本も解説。",
  alternates: { canonical: PAGE_URL },
};

const RELATED = [
  { href: "/articles/what-is-geo",    label: "GEOとは" },
  { href: "/articles/what-is-aio",    label: "AIOとは" },
  { href: "/articles/what-is-aeo",    label: "AEOとは" },
  { href: "/articles/what-is-ai-seo", label: "AI SEOとは" },
];

export default function WhatIsAiSearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI検索・AI検索最適化とは — 生成AI時代の情報収集の変化",
    description: "AI検索とは、AIが直接回答を生成する新しい検索形態。AI検索最適化の基本を解説。",
    url: PAGE_URL,
    datePublished: "2026-02-23",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mainEntity: {
      "@type": "DefinedTerm",
      name: "AI検索",
      alternateName: "AI Search",
      description: "ChatGPT・Perplexity・Google AI OverviewsなどのAIがユーザーの質問に直接回答を生成して提示する新しい検索形態。",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AI検索と従来の検索エンジンの違いは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "従来の検索エンジンはWebページの一覧を返し、ユーザー自身が情報を読み取ります。AI検索はユーザーの質問を理解して直接回答を生成します。複数のソースを統合して要約するため、ユーザーはサイトをクリックせずに情報を得られます。",
        },
      },
      {
        "@type": "Question",
        name: "AI検索最適化とSEOはどう違いますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SEOは検索結果での順位とクリック数を追求します。AI検索最適化（GEO・AEO・AIO）はAIの回答に引用・推薦されることを追求します。目標が「サイトへの誘導」から「AIによる言及」へと変化しています。",
        },
      },
    ],
  };

  const aiSearchEngines = [
    { name: "Perplexity",          desc: "リアルタイムWeb検索とAI回答を統合。引用元を明示する透明性が特徴。" },
    { name: "ChatGPT Search",      desc: "OpenAIが提供。GPT-4oによる高精度な回答生成と検索を組み合わせる。" },
    { name: "Google AI Overviews", desc: "Google検索結果の上部に表示されるAI生成の要約回答。" },
    { name: "Microsoft Copilot",   desc: "Bing検索とGPT-4を統合。Edgeブラウザに標準搭載。" },
  ];

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

        <h1>AI検索・AI検索最適化とは<br /><span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--neutral-600)" }}>生成AI時代の情報収集の変化</span></h1>

        <div className="definition-box">
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>定義</p>
          <p style={{ lineHeight: 1.8 }}>
            <strong>AI検索</strong>とは、ChatGPT・Perplexity・Google AI OverviewsなどのAIがユーザーの質問を解釈し、複数のWebソースを統合して直接回答を生成・提示する新しい検索形態。<strong>AI検索最適化</strong>とは、この新しい検索形態においてコンテンツが回答に採用されやすくするための戦略的対応の総称であり、<a href="/articles/what-is-geo" style={{ color: "var(--primary)" }}>GEO</a>・<a href="/articles/what-is-aeo" style={{ color: "var(--primary)" }}>AEO</a>・<a href="/articles/what-is-aio" style={{ color: "var(--primary)" }}>AIO</a>と同義。
          </p>
        </div>

        <h2>AI検索の台頭と従来検索との違い</h2>
        <p>
          2022〜2023年のChatGPT登場以降、情報収集の行動様式が急速に変化した。ユーザーは「検索ワードを入力して結果を自分で読み解く」から「自然言語で質問してAIに回答を生成してもらう」へとシフトしている。
        </p>
        <p>
          この変化がWebサイト運営に与えた影響は「検索結果に表示されてもクリックされない」というゼロクリック問題だ。AI検索が直接回答を提示するため、ユーザーがサイトを訪問するインセンティブが低下する。コンテンツ制作者にとっては、「クリックを獲得する」より「AI回答に引用される」ことが新たな目標になりつつある。
        </p>

        <h2>主なAI検索エンジン</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", margin: "1.25rem 0" }}>
          {aiSearchEngines.map((engine) => (
            <div key={engine.name} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              padding: "0.875rem 1.25rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 600, color: "var(--primary)", width: "140px", flexShrink: 0 }}>
                {engine.name}
              </span>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.6 }}>{engine.desc}</p>
            </div>
          ))}
        </div>

        <h2>AI検索最適化の基本戦略</h2>
        <p>
          AI検索最適化の核心は「AIが信頼できる情報源として認識できる形でコンテンツを提供すること」だ。以下の3点が最も優先度が高い対策となる。
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0" }}>
          {[
            { num: "01", title: "構造化データの実装", body: "JSON-LDによるSchema.orgスキーマの実装はAI検索最適化の基本。AIがコンテンツの種類・著者・日付・内容を正確に解釈できるようになる。GEO Labの実験ではJSON-LDがクローラーの来訪頻度に影響することが示唆されている。" },
            { num: "02", title: "一次情報・独自データの提供", body: "AIは「他で入手できない情報」を引用する価値が高い情報源と判断する傾向がある。独自調査・実験データ・専門家の見解など、一次情報の提供がAI検索最適化の差別化要因になる。" },
            { num: "03", title: "結論ファーストの文章構造", body: "AIは記事全体を読んで要約するのではなく、冒頭部分から回答を構成することが多い。記事の冒頭で結論と定義を明示し、その後で詳細を展開する構造が採用されやすい。" },
          ].map((item) => (
            <div key={item.num} style={{
              display: "flex",
              gap: "1rem",
              padding: "1rem 1.25rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--primary)",
              borderRadius: "var(--radius-sm)",
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color: "var(--border)", flexShrink: 0, lineHeight: 1.4 }}>
                {item.num}
              </span>
              <div>
                <p style={{ fontWeight: 600, marginBottom: "0.35rem", fontSize: "0.9rem" }}>{item.title}</p>
                <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>GEO Labの観測との関連</h2>
        <p>
          GEO Labはこのサイト自体がAI検索最適化の実験場だ。JSON-LDあり・なしのページを並行公開し、どちらのページがAIクローラーに多くクロールされるかを実データで観測している。また独自造語「GEOショック」「GEOショック指数」がAI検索に反映されるまでの速度も記録している。
        </p>
        <div className="observing-banner">
          実験中。リアルタイム観測データは
          <a href="/stats" style={{ color: "#92400E", textDecoration: "underline", marginLeft: "0.3rem" }}>観測レポート →</a>
        </div>

        <h2>よくある質問</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
          {[
            { q: "AI検索と従来の検索エンジンの違いは何ですか？", a: "従来の検索エンジンはWebページの一覧を返し、ユーザー自身が情報を読み取ります。AI検索はユーザーの質問を理解して直接回答を生成します。複数のソースを統合して要約するため、ユーザーはサイトをクリックせずに情報を得られます。" },
            { q: "AI検索最適化とSEOはどう違いますか？", a: "SEOは検索結果での順位とクリック数を追求します。AI検索最適化（GEO・AEO・AIO）はAIの回答に引用・推薦されることを追求します。目標が「サイトへの誘導」から「AIによる言及」へと変化しています。" },
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
