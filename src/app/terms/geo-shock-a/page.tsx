// 場所: src/app/terms/geo-shock-a/page.tsx
// GEOショック（GEO Shock）定義ページ A（JSON-LDあり・実験群）

import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com"}/terms/geo-shock-a`;

export const metadata: Metadata = {
  title: "GEOショックとは — GEO Lab 定義",
  description:
    "GEOショック（GEO Shock）とは、検索行動の主体がヒトからAIへと移行することで、既存のWebコンテンツ流通モデルが急激に変容する現象。GEO Lab が定義した独自概念。",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "GEOショックとは — GEO Lab 定義",
    url: PAGE_URL,
    type: "article",
  },
};

export default function GeoShockPageA() {
  const definedTermJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${PAGE_URL}#termset`,
    name: "GEO Lab 用語集",
    description: "GEO Lab が定義する生成エンジン最適化に関する独自概念",
    hasDefinedTerm: [
      {
        "@type": "DefinedTerm",
        "@id": `${PAGE_URL}#geo-shock`,
        name: "GEOショック",
        alternateName: "GEO Shock",
        termCode: "GS-001",
        description:
          "検索行動の主体がヒト（ブラウザ検索）からAI（生成エンジン）へと移行することで、既存のWebコンテンツ流通モデルが急激に変容する現象。SEOで最適化されたコンテンツがトラフィックを失い、GEOに最適化されたコンテンツがAIの回答パーツとして引用される新秩序への移行期に発生する構造的な衝撃。",
        url: PAGE_URL,
        inDefinedTermSet: `${PAGE_URL}#termset`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${PAGE_URL}#article`,
    headline: "GEOショック（GEO Shock）とは何か — GEO Lab による定義",
    description:
      "GEO Lab が定義した独自概念「GEOショック」の定義・背景・GEOショック指数との関係を解説する。",
    url: PAGE_URL,
    datePublished: "2026-02-22",
    author: { "@type": "Organization", name: "GEO Lab", url: process.env.NEXT_PUBLIC_SITE_URL },
    publisher: { "@type": "Organization", name: "GEO Lab" },
    mentions: [
      { "@id": `${PAGE_URL}#geo-shock` },
      { "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/terms/geo-shock-index-a#geo-shock-index` },
    ],
  };

  return (
    <>
      <JsonLd data={definedTermJsonLd} />
      <JsonLd data={articleJsonLd} />

      <article className="max-w-2xl">
        {/* 実験ラベル */}
        <div className="experiment-tag-bar">
          <span className="badge badge-primary">実験群 / JSON-LDあり</span>
          <span style={{ fontSize: "0.78rem", color: "var(--neutral-400)" }}>
            <a href="/terms/geo-shock-b" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              ページB（JSON-LDなし）
            </a>
            と比較観測中
          </span>
        </div>

        <h1>GEOショック（GEO Shock）</h1>

        {/* 定義ボックス */}
        <div className="definition-box">
          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.6rem", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            定義 / GS-001
          </p>
          <p style={{ lineHeight: 1.8, color: "var(--neutral)" }}>
            <strong>GEOショック</strong>（英: GEO Shock、定義コード: GS-001）とは、
            検索行動の主体がヒト（ブラウザ検索）からAI（生成エンジン）へと移行することで、
            既存のWebコンテンツ流通モデルが急激に変容する現象。
            SEOで最適化されたコンテンツがトラフィックを失い、
            GEOに最適化されたコンテンツがAIの回答パーツとして引用される
            新秩序への移行期に発生する構造的な衝撃を指す。
          </p>
        </div>

        <h2>背景</h2>
        <p>
          2024〜2026年にかけて、ユーザーの情報収集行動は「検索して自分で読む」から
          「AIに聞いて要約してもらう」へと急速にシフトした。
          この変化はWebサイト運営者にとって、従来のSEO戦略が通用しなくなるという
          「ショック」として現れる。
        </p>
        <p>
          GEOショックは単なるトラフィック減少現象ではなく、
          コンテンツの「読まれ方」そのものが変容する構造的な変化である。
          人間がリンクをクリックして読む時代から、
          AIがコンテンツを解析して回答を構成する時代への移行が、
          Webの経済モデルに与える衝撃の総称として GEO Lab は定義する。
        </p>

        <h2>GEOショックの3段階</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0" }}>
          {[
            {
              phase: "Phase 1",
              title: "クリック喪失期",
              desc: "AI OverviewやPerplexityがゼロクリック回答を提供し始め、検索結果のCTRが低下する。トラフィックが減少するが、原因に気づかない運営者が多い。",
            },
            {
              phase: "Phase 2",
              title: "インデックス再編期",
              desc: "AIクローラーがコンテンツを評価し始める。JSON-LDや一次情報を持つサイトが優先的にクロールされ、AIの回答に引用されるコンテンツとそうでないコンテンツの差が拡大する。",
            },
            {
              phase: "Phase 3",
              title: "GEO秩序確立期",
              desc: "AIの回答に継続的に引用されるサイトが「一次情報源」として地位を確立。SEO時代の「検索1位」に相当するGEO時代の「AI引用源」としての地位が固定化する。",
            },
          ].map((item) => (
            <div key={item.phase} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--primary)",
              borderRadius: "var(--radius-sm)",
              padding: "1rem 1.25rem",
            }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--primary)", marginBottom: "0.3rem" }}>
                {item.phase}
              </p>
              <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>{item.title}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--neutral-600)", lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2>GEOショックとGEOショック指数の関係</h2>
        <p>
          GEOショックが「現象」であるのに対し、
          <a href="/terms/geo-shock-index-a" style={{ color: "var(--primary)" }}>GEOショック指数（GSI-001）</a>は
          その影響度を数値化するための「測定指標」である。
          GEOショックの深刻度を定量的に把握するために GEO Lab が設計した実験的スコア。
        </p>

        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>種別</th>
              <th>定義コード</th>
              <th>役割</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GEOショック</td>
              <td>現象の定義</td>
              <td>GS-001</td>
              <td>AI移行期の構造変化を説明する概念</td>
            </tr>
            <tr>
              <td>GEOショック指数</td>
              <td>測定指標</td>
              <td>GSI-001</td>
              <td>JSON-LDのGEO効果を数値化するスコア</td>
            </tr>
          </tbody>
        </table>

        <h2>観測との関連</h2>
        <p>
          GEO Lab はGEOショックを「観測可能な現象」として捉え、
          実データによる検証を行っている。
          クロール頻度・造語の反映速度・ハニーポット踏破率は、
          すべてGEOショックの進行度を間接的に示す指標として位置づけられる。
        </p>

        <div className="observing-banner" style={{ marginTop: "2rem" }}>
          現在観測中。
          <a href="/stats" style={{ color: "#92400E", textDecoration: "underline", marginLeft: "0.4rem" }}>
            リアルタイム観測データはこちら →
          </a>
        </div>

        <div style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--neutral-400)" }}>
          <p>定義コード: GS-001 / 公開日: 2026-02-22 / GEO Lab</p>
          <p style={{ marginTop: "0.3rem" }}>
            関連:
            <a href="/terms/geo-shock-index-a" style={{ color: "var(--primary)", textDecoration: "underline", marginLeft: "0.4rem" }}>GEOショック指数（GSI-001）</a>
            <a href="/terms/geo-shock-b" style={{ color: "var(--neutral-400)", textDecoration: "underline", marginLeft: "0.75rem" }}>比較ページB（JSON-LDなし）</a>
          </p>
        </div>
      </article>
    </>
  );
}
