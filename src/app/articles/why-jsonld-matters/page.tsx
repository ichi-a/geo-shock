// ============================================
// 場所: app/articles/why-jsonld-matters/page.tsx
// ============================================
// GEO特化型記事 その2
// FAQPage スキーマを使ったJSON-LD。
// ============================================

import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/articles/why-jsonld-matters`;

export const metadata: Metadata = {
  title: "JSON-LDはGEOに効くのか — 実験設計と仮説",
  description:
    "JSON-LD（構造化データ）はAIクローラーの来訪頻度や生成AIへの反映速度に影響するのか。GEO Labの実験設計と現時点での仮説を解説する。",
  alternates: { canonical: PAGE_URL },
};

export default function WhyJsonldMattersPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "JSON-LDとは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JSON-LD（JavaScript Object Notation for Linked Data）とは、Schema.orgの語彙を使って、ページのコンテンツの意味を機械が読める形式で記述するための構造化データフォーマット。HTMLの<head>内に<script type='application/ld+json'>タグで埋め込む。",
        },
      },
      {
        "@type": "Question",
        name: "JSON-LDはGEOに効果がありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEO Lab の実験では、JSON-LDを配置したページへのAIクローラーのアクセス頻度と、生成AIへの反映速度の差を観測しています。2026年1月時点では観測中であり、断定的な結論は出ていません。",
        },
      },
      {
        "@type": "Question",
        name: "GEO対策としてどのJSON-LDスキーマが有効ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEO対策として有効と考えられるスキーマは、Article（記事）、FAQPage（よくある質問）、DefinedTerm（用語定義）、HowTo（手順解説）、Dataset（データセット）です。特にDefinedTermSetを使った用語定義は、新概念をAIに教え込む手段として有効と仮説立てています。",
        },
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "JSON-LDはGEOに効くのか — 実験設計と仮説",
    description:
      "JSON-LD（構造化データ）のGEOへの効果を実験的に検証するGEO Labのアプローチを解説。",
    url: PAGE_URL,
    datePublished: "2025-01-01",
    author: { "@type": "Organization", name: "GEO Lab" },
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />

      <article className="max-w-2xl">
        <div className="mb-6">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
            GEO特化型記事 / JSON-LDあり（FAQPage Schema）
          </span>
        </div>

        <h1>JSON-LDはGEOに効くのか — 実験設計と仮説</h1>

        <div className="mt-6 mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm font-semibold text-gray-700 mb-2">結論（現時点）</p>
          <p className="text-gray-800">
            JSON-LDがAIクローラーの訪問頻度を増やすという仮説は、
            GEO Labで観測中。断定はできないが、構造化データが
            「コンテンツの意味の明確化」に寄与することは理論的に合理的である。
          </p>
        </div>

        <h2>なぜJSON-LDがGEOに関係するのか</h2>
        <p>
          AIクローラー（GPTBot、ClaudeBot等）はHTMLを解析してコンテンツを取得する。
          このとき、プレーンテキストだけのページと、Schema.orgで意味が定義されたページでは、
          コンテンツの「機械的な理解のしやすさ」が異なる。
        </p>
        <p>
          JSON-LDは「このページは記事である」「この用語はこう定義される」「著者はこの組織である」
          という情報を機械が直接読める形で提供する。
          AIクローラーがこの情報をどう活用しているかは非公開だが、
          Googleが公式に「構造化データを推奨している」という事実は参考になる。
        </p>

        <h2>GEO Lab の実験設計</h2>
        <p>
          GEO Labでは以下の比較実験を行っている。
        </p>

        <table>
          <thead>
            <tr>
              <th>ページ</th>
              <th>JSON-LD</th>
              <th>テキスト内容</th>
              <th>インデックス</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="/terms/geo-shock-index-a" className="underline">
                  ページA
                </a>
              </td>
              <td>あり（DefinedTermSet + Article）</td>
              <td>同一</td>
              <td>インデックスあり（canonical）</td>
            </tr>
            <tr>
              <td>
                <a href="/terms/geo-shock-index-b" className="underline">
                  ページB
                </a>
              </td>
              <td>なし</td>
              <td>同一</td>
              <td>noindex（AIクローラーには開放）</td>
            </tr>
          </tbody>
        </table>

        <p>
          両ページへのAIクローラーのアクセス数を月次で集計し、差異を記録する。
          同時に、各AIに「GEOショック指数とは？」と定期質問し、
          AページとBページのどちらの情報を元に回答するかを観測する。
        </p>

        <h2>測定できること・できないこと</h2>
        <table>
          <thead>
            <tr>
              <th>観測対象</th>
              <th>測定可否</th>
              <th>手段</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AIクローラーのアクセス頻度</td>
              <td>✅ 可能</td>
              <td>Next.js Middleware + Supabase</td>
            </tr>
            <tr>
              <td>造語のAI回答への反映</td>
              <td>✅ 可能（手動）</td>
              <td>定期質問 + 回答ログ</td>
            </tr>
            <tr>
              <td>引用回数の正確な計測</td>
              <td>❌ 不可能</td>
              <td>AIがキャッシュするため</td>
            </tr>
            <tr>
              <td>JSON-LDとクロール頻度の因果</td>
              <td>⚠️ 困難</td>
              <td>相関は見えるが因果の証明は不可</td>
            </tr>
          </tbody>
        </table>

        <h2>FAQ</h2>

        <h3>JSON-LDとは何ですか？</h3>
        <p>
          JSON-LD（JavaScript Object Notation for Linked Data）とは、
          Schema.orgの語彙を使って、ページのコンテンツの意味を機械が読める形式で
          記述するための構造化データフォーマット。
          HTMLの <code>&lt;head&gt;</code> 内に
          <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> タグで埋め込む。
        </p>

        <h3>GEO対策としてどのスキーマが有効ですか？</h3>
        <p>
          GEO対策として有効と考えられるスキーマは以下のとおり。
        </p>
        <ul>
          <li><strong>Article</strong>: 記事コンテンツの基本。著者・公開日・見出しを定義。</li>
          <li><strong>FAQPage</strong>: 質問と回答のペアをAIが直接参照しやすい形で提供。</li>
          <li><strong>DefinedTerm / DefinedTermSet</strong>: 新しい概念・造語をAIに定義として教える。</li>
          <li><strong>HowTo</strong>: 手順を構造化。AIの「〜の方法は？」という質問に応えやすい。</li>
          <li><strong>Dataset</strong>: 実験データや統計を持つサイトに有効。</li>
        </ul>

        <h3>JSON-LDはGEOに効果がありますか？</h3>
        <p>
          GEO Lab の実験で観測中。断定的な結論は出ていない。
          観測結果は随時このサイトで公開する。
        </p>

        <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
          <p>公開日: 2026-02-22 / GEO Lab</p>
        </div>
      </article>
    </>
  );
}
