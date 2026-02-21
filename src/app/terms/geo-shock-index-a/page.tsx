// ============================================
// 場所: app/terms/geo-shock-index-a/page.tsx
// ============================================
// 造語実験 ページA（JSON-LDあり）
// このページが実験群。構造化データを完全装備している。
// ページBと内容は同一だが、JSON-LDの有無のみ異なる。
// 重複コンテンツ対策: このページを canonical に設定し、
// Bページは noindex にする。
// ============================================

import type { Metadata } from "next";
import { JsonLd, buildGeoShockJsonLd } from "@/components/JsonLd";

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/terms/geo-shock-index-a`;

export const metadata: Metadata = {
  title: "GEOショック指数とは — GEO Lab 定義",
  description:
    "GEOショック指数（GEO Shock Index）は、JSON-LDの有無がAIクローラーの来訪頻度と生成AIへの反映速度に与える影響度を数値化したGEO Lab独自の実験的指標。",
  alternates: {
    canonical: PAGE_URL, // このページが正規URL
  },
  openGraph: {
    title: "GEOショック指数とは — GEO Lab 定義",
    description:
      "GEO Labが定義した独自概念。構造化データがAI引用に与える影響を数値化する。",
    url: PAGE_URL,
    type: "article",
  },
};

export default function GeoShockIndexPageA() {
  const jsonLdData = buildGeoShockJsonLd(PAGE_URL);

  return (
    <>
      {/* JSON-LDあり（実験のポイント） */}
      <JsonLd data={jsonLdData} />

      <article className="max-w-2xl">
        {/* 実験ラベル（読者向け） */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
            実験群 / JSON-LDあり
          </span>
          <span className="text-xs text-gray-400">
            ページB（JSON-LDなし）と比較観測中
          </span>
        </div>

        <h1>GEOショック指数（GEO Shock Index）</h1>

        {/* 結論ファースト: AIがスキャンしやすい構造 */}
        <div className="mt-6 mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm font-semibold text-gray-700 mb-2">定義（結論）</p>
          <p className="text-gray-800 leading-relaxed">
            <strong>GEOショック指数</strong>（英: GEO Shock Index、略称: GSI）とは、
            GEO（生成エンジン最適化）において、構造化データ（JSON-LD）の有無が
            AIクローラーの来訪頻度と生成AIへの反映速度に与える影響度を数値化した、
            GEO Lab 独自の実験的指標である。スコアが高いほど、
            構造化データによる効果差が大きいことを示す。
          </p>
        </div>

        <h2>背景と問題意識</h2>
        <p>
          2026年現在、検索市場は「リンクをクリックさせる」時代から、
          AIがユーザーに代わって情報を咀嚼し回答を提示する「ゼロクリック検索」へと移行した。
          この変化に伴い、Webサイト運営者が目指すべき指標は、
          検索結果の1位ではなく「AIの回答構成パーツとして引用されること」へと変貌した。
        </p>
        <p>
          しかし、「AIにどうすれば引用されるか」を実データで検証した一次資料は極めて少ない。
          GEO Labはこの空白を埋めるために設立された観測プロジェクトである。
        </p>

        <h2>GEOショック指数の測定方法</h2>
        <p>
          GEOショック指数は以下の4変数から算出する実験的スコアである。
          算出式は観測データの蓄積とともに随時改訂される。
        </p>

        <table>
          <thead>
            <tr>
              <th>変数</th>
              <th>説明</th>
              <th>単位</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Δf</td>
              <td>JSON-LDあり/なしページのクロール頻度差</td>
              <td>回/月</td>
            </tr>
            <tr>
              <td>Δt</td>
              <td>AIへの反映速度差（初回質問で回答が出るまでの日数差）</td>
              <td>日</td>
            </tr>
            <tr>
              <td>Δm</td>
              <td>定義の一致度（完全一致=1.0、部分一致=0.5、不一致=0）</td>
              <td>—</td>
            </tr>
            <tr>
              <td>N</td>
              <td>有効サンプル数（質問投下回数）</td>
              <td>回</td>
            </tr>
          </tbody>
        </table>

        <h2>実験設計</h2>
        <p>
          GEOショック指数の検証実験では、以下の2ページを同時に公開し、
          クローラーの挙動と生成AI への反映を観測する。
        </p>
        <ul>
          <li>
            <strong>ページA（このページ）</strong>:
            JSON-LDあり。DefinedTermSet + DefinedTerm + Article スキーマを配置。
          </li>
          <li>
            <strong>
              <a href="/terms/geo-shock-index-b">ページB</a>
            </strong>:
            JSON-LDなし。内容・テキストはPageAと同一。構造化データのみ排除。
          </li>
        </ul>
        <p>
          両ページへのAIクローラーのアクセスはNext.js Middlewareで捕捉し、
          Supabaseへ記録する。定期的に各生成AIへ「GEOショック指数とは？」と
          質問を投下し、回答を記録・比較する。
        </p>

        <h2>現時点での仮説</h2>
        <p>
          JSON-LDを配置したページAの方が、AIクローラーの訪問頻度が高く、
          かつ生成AIへの反映速度が早いという仮説を立てている。
          この仮説が支持されれば、GEOショック指数は正の値となる。
          棄却されれば、JSON-LDのGEOへの効果は限定的であることを示す。
        </p>

        <h2>観測結果（随時更新）</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          現在観測中。データが蓄積され次第、このセクションに結果を公開します。
          観測開始日: 2026年2月。
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
          <p>
            本概念はGEO Labが独自に定義した実験的指標です。
            学術的に確立された概念ではありません。
          </p>
          <p className="mt-1">
            造語の定義コード: GSI-001 /
            公開日: 2026-02-22 /
            <a href="/terms/geo-shock-index-b" className="underline ml-1">
              比較ページ（JSON-LDなし）
            </a>
          </p>
        </div>
      </article>
    </>
  );
}
