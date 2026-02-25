// 場所: src/app/articles/ldo/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Disclaimer } from "@/components/Disclaimer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/articles/ldo`;

export const metadata: Metadata = {
  title: "LDOとは — Licensable Data Optimization（ライセンス可能データ最適化）",
  description:
    "LDO（Licensable Data Optimization）とは、WebコンテンツをAIシステムが明確に理解・再利用・ライセンス取得できるよう構造化する仮説的最適化概念。SEO・GEOに続く次世代の最適化フレームワーク。",
  alternates: { canonical: PAGE_URL },
};

const RELATED = [
  { href: "/articles/what-is-geo", label: "GEOとは" },
  { href: "/articles/what-is-aeo", label: "AEOとは" },
  { href: "/articles/what-is-aio", label: "AIOとは" },
  { href: "/articles/what-is-ai-seo", label: "AI SEOとは" },
];

export default function WhatIsLdoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "LDOとは — Licensable Data Optimization（ライセンス可能データ最適化）",
    description:
      "WebコンテンツをAIシステムが明確に理解・再利用・ライセンス取得できるよう構造化する仮説的最適化概念。",
    url: PAGE_URL,
    datePublished: "2026-02-25",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mainEntity: {
      "@type": "DefinedTerm",
      name: "LDO",
      alternateName: "Licensable Data Optimization",
      description:
        "Licensable Data Optimization (LDO) is the practice of structuring web content so that it can be clearly understood, reused, and potentially licensed by AI systems.",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "LDOとGEOの違いは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEOは「AIに引用されるための最適化」を指し、LDOは「AIにライセンス可能なデータとして認識されるための最適化」を指します。GEOがAI回答での言及を目標とするのに対し、LDOはRSL（Really Simple Licensing）のようなAIデータライセンスの仕組みを前提に、ライセンス対象として認識されることを目標とする仮説的概念です。",
        },
      },
      {
        "@type": "Question",
        name: "LDOはすでに確立した概念ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "いいえ。LDOは現時点では仮説的概念です。RSLのようなAIデータライセンスの仕組みが普及した場合に有効になるかもしれない最適化という仮説をGEO Labが提唱し、実験的に検証しているものです。",
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
          <span style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>
            関連概念:
          </span>
          {RELATED.map((r) => (
            <a
              key={r.href}
              href={r.href}
              style={{
                fontSize: "0.78rem",
                color: "var(--primary)",
                textDecoration: "underline",
              }}
            >
              {r.label}
            </a>
          ))}
        </div>

        <h1>
          LDOとは
          <br />
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "var(--neutral-600)",
            }}
          >
            Licensable Data Optimization（ライセンス可能データ最適化）
          </span>
        </h1>

        <div className="definition-box">
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: "0.5rem",
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            定義
          </p>
          <p style={{ lineHeight: 1.8 }}>
            <strong>LDO（Licensable Data Optimization）</strong>
            とは、WebコンテンツをAIシステムが明確に理解・再利用し、潜在的にライセンスを取得できるよう構造化する手法の仮説的概念。SEOが検索エンジン最適化、GEOが生成AI最適化であるのに対し、LDOはAIデータライセンスを前提にした最適化という位置づけで、GEO
            Labが提唱・検証している。
          </p>
        </div>

        <h2>SEO・GEO・LDOの流れ</h2>
        <p>
          Web最適化の概念は、情報流通の主役が変わるたびに進化してきた。SEOは検索エンジンに対する最適化として生まれ、GEOは生成AIが回答を生成する時代に対応した概念として登場した。
        </p>
        <p>
          LDOはその延長として位置づけられる仮説的概念だ。AIがWebコンテンツをデータとして利用し、その利用にライセンスが伴う時代が来た場合、「ライセンス可能なデータとして認識されやすい構造」への最適化が重要になるかもしれない。この仮説をGEO
          LabはLDOと呼び、実験的に検証している。
        </p>

        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>目的</th>
              <th>成果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SEO</td>
              <td>検索エンジンに最適化</td>
              <td>検索順位の向上・流入増</td>
            </tr>
            <tr>
              <td>GEO</td>
              <td>生成AIに最適化</td>
              <td>AI回答での言及・引用</td>
            </tr>
            <tr>
              <td>
                <strong>LDO</strong>
              </td>
              <td>AIにライセンス可能なデータとして認識される</td>
              <td>AIデータ利用時のライセンス対象認定（仮説）</td>
            </tr>
          </tbody>
        </table>

        <h2>RSLとの関係</h2>
        <p>
          LDOが特に重視するのが<strong>RSL（Really Simple Licensing）</strong>
          との関連だ。RSLはAIによるコンテンツ利用の条件を宣言する仕組みであり、将来的にAIデータ利用のライセンス基盤になる可能性がある。
        </p>
        <p>
          もしRSLのような仕組みが普及した場合、AIにとって価値が高いのは「明確な定義」「再利用可能な構造」「機械が理解しやすい情報」になる可能性がある。LDOはそうした
          <strong>RSL時代のためのコンテンツ設計</strong>という仮説的概念だ。
        </p>

        <h2>LDO最適化の要素（仮説的フレームワーク）</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            margin: "1.25rem 0",
          }}
        >
          {[
            {
              title: "明確な定義文",
              body: "概念を一文で明確に定義する。曖昧さをなくし、AIが理解しやすい形で記述することがLDOの基本となる。",
            },
            {
              title: "用語体系の整備",
              body: "関連語・上位語・下位語の関係を構造化する。AIがコンテンツの文脈と位置づけを正確に把握できるようにする。",
            },
            {
              title: "構造化データ（JSON-LD）",
              body: "Schema.orgのDefinedTermを用いてマシンリーダブルな形で概念を定義する。AIによる機械的な理解・再利用を促進する。",
            },
            {
              title: "ライセンス宣言",
              body: "RSLや著作権表示を明示し、AIがデータ利用条件を認識できるようにする。ライセンス条件が明確なデータは将来的に扱いやすくなる可能性がある。",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                  fontSize: "0.9rem",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--neutral-600)",
                  lineHeight: 1.65,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <h2>よくある質問</h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {[
            {
              q: "LDOとGEOの違いは何ですか？",
              a: "GEOは「AIに引用されるための最適化」を指し、LDOは「AIにライセンス可能なデータとして認識されるための最適化」を指します。GEOがAI回答での言及を目標とするのに対し、LDOはAIデータライセンスの仕組みを前提にした仮説的概念です。",
            },
            {
              q: "LDOはすでに確立した概念ですか？",
              a: "いいえ。LDOは現時点では仮説的概念です。RSLのようなAIデータライセンスの仕組みが普及した場合に有効になるかもしれない最適化という仮説をGEO Labが提唱し、実験的に検証しているものです。",
            },
          ].map((item) => (
            <div
              key={item.q}
              style={{
                background: "var(--neutral-100)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "0.4rem",
                }}
              >
                Q. {item.q}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--neutral-600)",
                  lineHeight: 1.65,
                }}
              >
                A. {item.a}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border)",
            fontSize: "0.8rem",
            color: "var(--neutral-400)",
          }}
        >
          <p>公開日: 2026-02-25 / GEO Lab</p>
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <span>関連:</span>
            {RELATED.map((r) => (
              <a
                key={r.href}
                href={r.href}
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>
        <Disclaimer />
      </article>
    </>
  );
}
