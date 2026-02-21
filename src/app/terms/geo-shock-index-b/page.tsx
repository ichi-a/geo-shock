// ============================================
// 場所: app/terms/geo-shock-index-b/page.tsx
// ============================================
// 造語実験 ページB（JSON-LDなし）
// 対照群。Aページと内容は同一だが、構造化データを一切含まない。
// noindex設定: 重複コンテンツとしてGoogleにインデックスさせない。
// ただし AIクローラーには来訪してほしいので robots.txt では制限しない。
// ============================================

import type { Metadata } from "next";

const CANONICAL_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/terms/geo-shock-index-a`;

export const metadata: Metadata = {
  title: "GEOショック指数 — 比較ページB（JSON-LDなし）",
  description:
    "GEOショック指数（GEO Shock Index）のJSON-LDなし版。ページAとの比較実験用。",
  // Googleには noindex（重複回避）
  robots: { index: false, follow: true },
  // canonical は A ページに向ける
  alternates: { canonical: CANONICAL_URL },
};

export default function GeoShockIndexPageB() {
  // JSON-LDは一切埋め込まない（これが実験のポイント）

  return (
    <article className="max-w-2xl">
      {/* 実験ラベル */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1">
          対照群 / JSON-LDなし
        </span>
        <span className="text-xs text-gray-400">
          <a href="/terms/geo-shock-index-a" className="underline">
            ページA（JSON-LDあり）
          </a>
          と比較観測中
        </span>
      </div>

      <h1>GEOショック指数（GEO Shock Index）</h1>

      {/* 内容はページAと同一 */}
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
          <strong>
            <a href="/terms/geo-shock-index-a">ページA</a>
          </strong>:
          JSON-LDあり。DefinedTermSet + DefinedTerm + Article スキーマを配置。
        </li>
        <li>
          <strong>ページB（このページ）</strong>:
          JSON-LDなし。内容・テキストはPageAと同一。構造化データのみ排除。
        </li>
      </ul>

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
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
        <p>このページはJSON-LDなしの対照群です（実験目的）。</p>
        <p className="mt-1">
          <a href="/terms/geo-shock-index-a" className="underline">
            正規ページ（JSON-LDあり）はこちら
          </a>
        </p>
      </div>
    </article>
  );
}
