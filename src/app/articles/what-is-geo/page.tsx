// ============================================
// 場所: app/articles/what-is-geo/page.tsx
// ============================================
// GEO特化型記事（実験群）
// - JSON-LDあり（Article + FAQPage）
// - 結論ファーストの構成
// - テーブルタグを使った情報整理
// - AIがスキャンしやすい見出し構造
// ============================================

import type { Metadata } from "next";
import { JsonLd, buildGeoArticleJsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/articles/what-is-geo`;

export const metadata: Metadata = {
  title: "GEO（生成エンジン最適化）とは何か",
  description:
    "AIO(AI Optimization: AI検索最適化)の一部である、GEO（Generative Engine Optimization）とは、ChatGPT・Perplexity・GeminiなどのAIに回答の参照元として引用されるための最適化手法。SEOとの違い、具体的な対策方法を解説。",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "GEO（生成エンジン最適化）とは何か",
    url: PAGE_URL,
    type: "article",
  },
};

export default function WhatIsGeoPage() {
  const jsonLd = buildGeoArticleJsonLd({
    headline: "GEO（生成エンジン最適化）とは何か",
    description:
      "GEO（Generative Engine Optimization）の定義・SEOとの違い・具体的な対策を解説する。",
    datePublished: "2025-01-01",
    pageUrl: PAGE_URL,
  });

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="max-w-2xl">
        <div className="mb-6">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
            GEO特化型記事 / JSON-LDあり
          </span>
        </div>

        <h1>GEO（AIO・AEO・AI SEO）とは何か</h1>

        {/* 結論ファースト */}
        <div className="mt-6 mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm font-semibold text-gray-700 mb-2">この記事の結論</p>
          <p className="text-gray-800">
            AIO（AI Optimization: AI検索最適化）の一部である、GEO（Generative Engine Optimization）とは、ChatGPT・Perplexity・Gemini などの
            生成AIが回答を生成する際に、自分のコンテンツが引用・参照されることを目的とした最適化手法。
            従来のSEOが「検索順位1位を目指す」のに対し、GEOは「AIの回答パーツになる」ことを目指す。
          </p>
        </div>

        <h2>SEOとGEOの違い</h2>
        <p>
          従来のSEO（検索エンジン最適化）は、Googleのアルゴリズムに対して
          コンテンツを最適化することで検索順位を上げ、クリックを獲得することが目的だった。
          しかし2024〜2026年にかけて、ユーザーの情報収集行動は大きく変化した。
        </p>

        <table>
          <thead>
            <tr>
              <th>項目</th>
              <th>SEO（従来）</th>
              <th>GEO（2026年〜）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>目的</td>
              <td>検索順位1位</td>
              <td>AIの回答に引用される</td>
            </tr>
            <tr>
              <td>相手</td>
              <td>Googleのクローラー</td>
              <td>GPTBot, ClaudeBot, PerplexityBot 等</td>
            </tr>
            <tr>
              <td>成果指標</td>
              <td>クリック数・PV</td>
              <td>引用回数・Citations</td>
            </tr>
            <tr>
              <td>コンテンツ形式</td>
              <td>キーワード密度・被リンク</td>
              <td>構造化データ・事実・一次情報</td>
            </tr>
            <tr>
              <td>評価主体</td>
              <td>Googleのアルゴリズム</td>
              <td>LLMのアテンション機構</td>
            </tr>
          </tbody>
        </table>

        <h2>GEOの具体的な施策</h2>
        <p>
          GEOに効果があると考えられている施策を、確実性の高いものから順に示す。
          ただし、2026年現在においても実験的要素が多く、GEO Lab での検証中の項目を含む。
        </p>

        <h3>1. JSON-LD（構造化データ）の配置</h3>
        <p>
          Schema.org に準拠した JSON-LD を配置することで、
          AIクローラーがコンテンツの意味を正確に解釈できるようになる。
          特に <code>Article</code>、<code>FAQPage</code>、<code>DefinedTerm</code> スキーマが
          GEOにおいて有効と考えられている。
        </p>

        <h3>2. 結論ファーストの文章構造</h3>
        <p>
          LLMはテキストをトークン単位でスキャンする。
          結論・定義を冒頭に配置することで、AIが情報を正確に抽出しやすくなる。
          「起承転結」ではなく「結論→根拠→詳細」の順で書く。
        </p>

        <h3>3. 一次情報・独自データの掲載</h3>
        <p>
          AIは「ネットにある情報の要約」は生成できるが、
          「人間が観測・実験した一次データ」は持っていない。
          オリジナルデータ・独自の実験結果・独自定義の造語を掲載することで、
          AIが引用せざるを得ない情報源になれる。
        </p>

        <h3>4. E-E-A-T の強化</h3>
        <p>
          経験（Experience）・専門性（Expertise）・権威性（Authoritativeness）・
          信頼性（Trustworthiness）を示す情報をページに含める。
          著者情報・参考文献・更新日時の明示が有効。
        </p>

        <h2>GEOで注意すべきこと</h2>
        <p>
          GEOには、SEOと異なる構造的な制約がある。
          最大の問題は「引用されたかどうかを直接計測できない」点だ。
          AIクローラーのアクセスログは取得できるが、
          そのクローラーがキャッシュした内容を何百万回引用したとしても、
          その事実はサーバーログには現れない。
        </p>
        <p>
          GEO Lab では、この制約を「観測可能な代理指標に絞る」ことで対処している。
          クロール頻度・ハルシネーション誘発語の反映・JSON-LDの効果差を
          観測可能な範囲で記録・公開することが、このプロジェクトの核心である。
        </p>

        <h2>まとめ</h2>
        <p>
          GEOはSEOの代替ではなく、進化形である。
          2026年現在、SEOを通過しなければGEOの土俵にも立てない。
          まず検索エンジンにインデックスされ、その上でAIに引用される構造を作ることが、
          コンテンツ発信者が取るべき戦略の順序である。
        </p>

        <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500 space-y-1">
          <p>公開日: 2026-02-22 / GEO Lab</p>
          <p>
            関連:
            <a href="/terms/geo-shock-a" className="underline ml-2">
              GEOショックの定義
            </a>
            <a href="/terms/geo-shock-index-a" className="underline ml-2">
              GEOショック指数の定義
            </a>
            <a href="/articles/why-jsonld-matters" className="underline ml-2">
              JSON-LDはGEOに効くのか
            </a>
          </p>
        </div>
      </article>
    </>
  );
}
