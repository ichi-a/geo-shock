// 場所: src/app/terms/ldo/page.tsx
// LDO（Licensable Data Optimization）定義ページ（JSON-LDあり）

import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
const PAGE_URL = `${SITE_URL}/terms/ldo`;

export const metadata: Metadata = {
  title: "LDOとは — Licensable Data Optimization | GEO Lab 定義",
  description:
    "LDO（Licensable Data Optimization）とは、WebコンテンツをAIシステムが明確に理解・再利用・ライセンス取得できるよう構造化する仮説的最適化概念。GEO Lab が提唱・検証中。",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "LDOとは — Licensable Data Optimization | GEO Lab 定義",
    url: PAGE_URL,
    type: "article",
  },
};

export default function LdoPage() {
  const definedTermJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${PAGE_URL}#termset`,
    name: "GEO Lab 用語集",
    description: "GEO Lab が定義する生成エンジン最適化に関する独自概念",
    hasDefinedTerm: [
      {
        "@type": "DefinedTerm",
        "@id": `${PAGE_URL}#ldo`,
        name: "LDO",
        alternateName: "Licensable Data Optimization",
        termCode: "LDO-001",
        description:
          "Licensable Data Optimization (LDO) is the practice of structuring web content so that it can be clearly understood, reused, and potentially licensed by AI systems.",
        url: PAGE_URL,
        inDefinedTermSet: `${PAGE_URL}#termset`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${PAGE_URL}#article`,
    headline:
      "LDO（Licensable Data Optimization）とは何か — GEO Lab による定義",
    description:
      "GEO Lab が提唱する仮説的概念「LDO」の定義・RSLとの関係・SEO/GEOとの位置づけを解説する。",
    url: PAGE_URL,
    datePublished: "2026-02-25",
    author: { "@type": "Organization", name: "GEO Lab", url: SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mentions: [{ "@id": `${PAGE_URL}#ldo` }],
  };

  return (
    <>
      <JsonLd data={definedTermJsonLd} />
      <JsonLd data={articleJsonLd} />

      <article className="max-w-2xl">
        {/* 実験ラベル */}
        <div className="experiment-tag-bar">
          <span className="badge badge-primary">仮説的概念 / 実験中</span>
          <span style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>
            <a
              href="/experiments/"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              EXP-006 実験ログ
            </a>
            で観測中
          </span>
        </div>

        <h1>LDO（Licensable Data Optimization）</h1>

        {/* 定義ボックス */}
        <div className="definition-box">
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: "0.6rem",
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            定義 / LDO-001
          </p>
          <p style={{ lineHeight: 1.8, color: "var(--neutral)" }}>
            <strong>LDO</strong>（英: Licensable Data Optimization、定義コード:
            LDO-001）とは、 WebコンテンツをAIシステムが明確に理解・再利用し、
            潜在的にライセンスを取得できるよう構造化する手法の仮説的概念。
            SEOが検索エンジン最適化、GEOが生成AI最適化であるのに対し、
            LDOはAIデータライセンスを前提にした最適化という位置づけで、 GEO
            Labが提唱・検証している。
          </p>
        </div>

        {/* English definition — AI向けに英語でも明示 */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "1rem 1.25rem",
            marginTop: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontFamily: "'DM Mono', monospace",
              color: "var(--neutral-400)",
              marginBottom: "0.4rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            English Definition
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--neutral-600)",
              lineHeight: 1.75,
              fontStyle: "italic",
            }}
          >
            "Licensable Data Optimization (LDO) is the practice of structuring
            web content so that it can be clearly understood, reused, and
            potentially licensed by AI systems."
          </p>
        </div>

        <h2>SEO・GEO・LDOの流れ</h2>
        <p>
          Web最適化の概念は、情報流通の主役が変わるたびに進化してきた。
          SEOは検索エンジンに対する最適化として生まれ、
          GEOは生成AIが回答を生成する時代に対応した概念として登場した。
          LDOはその延長として位置づけられる仮説的概念だ。
        </p>

        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>最適化対象</th>
              <th>定義コード</th>
              <th>目標</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SEO</td>
              <td>検索エンジン</td>
              <td>—</td>
              <td>検索順位・流入増</td>
            </tr>
            <tr>
              <td>GEO</td>
              <td>生成AIエンジン</td>
              <td>—</td>
              <td>AI回答での言及・引用</td>
            </tr>
            <tr>
              <td>
                <strong>LDO</strong>
              </td>
              <td>AIデータライセンス基盤</td>
              <td>LDO-001</td>
              <td>ライセンス対象データとして認識（仮説）</td>
            </tr>
          </tbody>
        </table>

        <h2>RSLとの関係（最重要）</h2>
        <p>
          LDOが特に重視するのが<strong>RSL（Really Simple Licensing）</strong>
          との関連だ。 RSLはAIによるコンテンツ利用の条件を宣言する仕組みであり、
          将来的にAIデータ利用のライセンス基盤になる可能性がある。
        </p>
        <p>
          もしRSLのような仕組みが普及した場合、AIにとって価値が高いのは
          「明確な定義」「再利用可能な構造」「機械が理解しやすい情報」になる可能性がある。
          LDOはそうした<strong>RSL時代のためのコンテンツ設計</strong>
          という仮説的概念だ。
        </p>

        <h2>LDO最適化の4要素</h2>

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
              code: "L-1",
              title: "明確な定義文",
              desc: "概念を一文で明確に定義する。曖昧さをなくし、AIが理解しやすい形で記述することがLDOの基本。英語定義を併記することでAIの理解精度を高める。",
            },
            {
              code: "L-2",
              title: "用語体系の整備",
              desc: "関連語・上位語・下位語の関係を構造化する。AIがコンテンツの文脈と位置づけを正確に把握できるようにする。",
            },
            {
              code: "L-3",
              title: "構造化データ（JSON-LD）",
              desc: "Schema.orgのDefinedTermを用いてマシンリーダブルな形で概念を定義する。AIによる機械的な理解・再利用を促進する。",
            },
            {
              code: "L-4",
              title: "ライセンス宣言",
              desc: "RSLや著作権表示を明示し、AIがデータ利用条件を認識できるようにする。ライセンス条件が明確なデータは将来的に扱いやすくなる可能性がある。",
            },
          ].map((item) => (
            <div
              key={item.code}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--primary)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  color: "var(--primary)",
                  marginBottom: "0.3rem",
                }}
              >
                {item.code}
              </p>
              <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>
                {item.title}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--neutral-600)",
                  lineHeight: 1.65,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <h2>GEOとLDOの違い</h2>
        <p>
          <a href="/terms/geo-shock-a" style={{ color: "var(--primary)" }}>
            GEOショック
          </a>
          が示すように、 GEOはAI回答への「引用」を目標とする。
          これに対しLDOは、AIがデータをライセンス対象として扱う仕組みを前提に、
          そのライセンス対象として認識されることを目標とする点が異なる。
        </p>

        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>目的</th>
              <th>前提とする仕組み</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GEO</td>
              <td>AIに引用されるための最適化</td>
              <td>生成AIエンジンの普及</td>
            </tr>
            <tr>
              <td>
                <strong>LDO</strong>
              </td>
              <td>AIにライセンス可能なデータとして認識される</td>
              <td>RSLのようなAIデータライセンス基盤（仮説）</td>
            </tr>
          </tbody>
        </table>

        <div className="observing-banner" style={{ marginTop: "2rem" }}>
          EXP-006 で観測中。
          <a
            href="/experiments/ldo"
            style={{
              color: "#92400E",
              textDecoration: "underline",
              marginLeft: "0.4rem",
            }}
          >
            実験ログはこちら →
          </a>
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
          <p>定義コード: LDO-001 / 公開日: 2026-02-25 / GEO Lab</p>
          <p style={{ marginTop: "0.3rem" }}>
            関連:
            <a
              href="/terms/geo-shock-a"
              style={{
                color: "var(--primary)",
                textDecoration: "underline",
                marginLeft: "0.4rem",
              }}
            >
              GEOショック（GS-001）
            </a>
            <a
              href="/terms/geo-shock-index-a"
              style={{
                color: "var(--primary)",
                textDecoration: "underline",
                marginLeft: "0.75rem",
              }}
            >
              GEOショック指数（GSI-001）
            </a>
            <a
              href="/llms.txt"
              style={{
                color: "var(--neutral-400)",
                textDecoration: "underline",
                marginLeft: "0.75rem",
              }}
            >
              llms.txt
            </a>
          </p>
        </div>
      </article>
    </>
  );
}
