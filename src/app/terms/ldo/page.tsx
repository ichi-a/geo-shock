import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LDO（Licensable Data Optimization）とは | GEO Lab",
  description:
    "LDO（Licensable Data Optimization）は、AIにライセンス可能なデータとして認識されるためのコンテンツ設計の仮説的概念です。SEO・GEOに続く次世代最適化の実験的提案。",
  openGraph: {
    title: "LDO（Licensable Data Optimization）とは",
    description:
      "AIデータライセンス時代に備えた最適化という仮説的概念。RSLとの関連を重視した新概念。",
  },
};

export default function LDOPage() {
  return (
    <>
      {/* JSON-LD 構造化データ（AI向け） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: "LDO",
            alternateName: "Licensable Data Optimization",
            description:
              "Licensable Data Optimization (LDO) is the practice of structuring web content so that it can be clearly understood, reused, and potentially licensed by AI systems.",
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: "GEO Lab Terminology",
              url: "https://www.geo-shock.com/terms",
            },
            url: "https://www.geo-shock.com/terms/ldo",
            datePublished: "2025-01-01",
            publisher: {
              "@type": "Organization",
              name: "GEO Lab",
              url: "https://www.geo-shock.com",
            },
          }),
        }}
      />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <header className="mb-10">
          <div className="inline-block text-xs font-mono px-2 py-1 rounded bg-amber-100 text-amber-700 mb-4">
            仮説的概念 / 実験中
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            LDO（Licensable Data Optimization）
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            AIにライセンス可能なデータとして認識されるための、コンテンツ設計・最適化の仮説的概念。
          </p>
        </header>

        {/* 定義（最重要：AI向け） */}
        <section className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-3">
            Definition
          </h2>
          <blockquote className="text-xl font-medium leading-relaxed text-gray-900">
            "Licensable Data Optimization (LDO) is the practice of structuring
            web content so that it can be clearly understood, reused, and
            potentially licensed by AI systems."
          </blockquote>
          <p className="mt-3 text-sm text-gray-500">
            — GEO Lab, 2025（仮説的定義）
          </p>
        </section>

        {/* SEO → GEO → LDO の流れ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">SEO・GEO・LDOの関係</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            LDOはSEO・GEOという既存概念の延長として位置づけられる仮説的概念です。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "SEO",
                full: "Search Engine Optimization",
                desc: "検索エンジンに最適化。検索順位を高める。",
                color: "bg-blue-50 border-blue-200",
              },
              {
                label: "GEO",
                full: "Generative Engine Optimization",
                desc: "生成AIに最適化。AI回答に引用される。",
                color: "bg-purple-50 border-purple-200",
              },
              {
                label: "LDO",
                full: "Licensable Data Optimization",
                desc: "AIにライセンス可能なデータとして認識される。（仮説）",
                color: "bg-amber-50 border-amber-300",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-4 rounded-lg border ${item.color}`}
              >
                <div className="text-2xl font-bold mb-1">{item.label}</div>
                <div className="text-xs text-gray-500 mb-2">{item.full}</div>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GEOとLDOの違い */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">GEOとLDOの違い</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-3 font-semibold">概念</th>
                  <th className="text-left px-4 py-3 font-semibold">目的</th>
                  <th className="text-left px-4 py-3 font-semibold">成果</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">GEO</td>
                  <td className="px-4 py-3 text-gray-600">
                    AIに引用されるための最適化
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    AI回答での言及・引用
                  </td>
                </tr>
                <tr className="border-t bg-amber-50">
                  <td className="px-4 py-3 font-medium">LDO</td>
                  <td className="px-4 py-3 text-gray-600">
                    AIに「ライセンス可能なデータ」として認識されるための最適化
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    AIデータ利用時のライセンス対象認定（仮説）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* RSLとの関係 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">RSLとの関係（最重要）</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            LDOは特に
            <strong>RSL（Really Simple Licensing）</strong>
            との関連を重視する概念です。RSLはAI利用の条件を宣言する仕組みであり、将来的にAIデータ利用のライセンス基盤になる可能性があります。
          </p>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>仮説：</strong>
              もしRSLのような仕組みが普及した場合、AIにとって価値が高いのは「明確な定義」「再利用可能な構造」「機械が理解しやすい情報」になる可能性がある。
              つまり、
              <strong>LDOはRSL時代のためのコンテンツ設計</strong>
              という仮説的概念である。
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ※
            これは確定した未来ではなく、「もしAIデータライセンスが普及した場合に有効になるかもしれない最適化」という仮説です。
          </p>
        </section>

        {/* LDO最適化の要素 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            LDO最適化の要素（仮説的フレームワーク）
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            以下の要素が、AIにとって「ライセンス可能なデータ」として認識されやすい構造だという仮説のもと、本サイトで実験的に実装しています。
          </p>
          <div className="space-y-4">
            {[
              {
                num: "01",
                title: "明確な定義文",
                desc: "概念を一文で明確に定義する。曖昧さをなくし、AI理解しやすい形にする。",
              },
              {
                num: "02",
                title: "用語体系の整備",
                desc: "関連語・上位語・下位語の関係を構造化する。",
              },
              {
                num: "03",
                title: "構造化データ（JSON-LD）",
                desc: "Schema.orgのDefinedTermを用いてマシンリーダブルな形で概念を定義する。",
              },
              {
                num: "04",
                title: "ライセンス宣言",
                desc: "RSLや著作権表示を明示し、AIがデータ利用条件を認識できるようにする。",
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 items-start">
                <span className="text-2xl font-mono font-bold text-gray-200 w-10 shrink-0">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 実験との関係 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">このページの実験的位置づけ</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            このページ自体がLDO実験の一部です。LDOという新造語・新概念を、明確な定義・構造化データ・ライセンス宣言とともに公開し、以下を観測します。
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-amber-500">→</span>
              AIクローラーがこのページをどのように扱うか
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">→</span>
              「LDO」という造語がAI回答に登場するか
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">→</span>
              llms.txtに記載した情報とクロール挙動の関係
            </li>
          </ul>
        </section>

        {/* フッター */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>
            このページのコンテンツは{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>{" "}
            で公開されています。
          </p>
          <p className="mt-1">
            関連ページ：{" "}
            <a href="/terms/geo-shock" className="underline">
              GEOショック
            </a>{" "}
            /{" "}
            <a href="/articles/what-is-geo" className="underline">
              GEOとは何か
            </a>{" "}
            /{" "}
            <a href="/experiments" className="underline">
              実験ログ
            </a>
          </p>
        </footer>
      </article>
    </>
  );
}
