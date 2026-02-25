import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EXP-004：LDO実験 — LLMs.txtとAIデータ認識の観測 | GEO Lab",
  description:
    "LDO（Licensable Data Optimization）という仮説的概念を提案し、llms.txtの限定的実装とあわせてAIクローラーの挙動変化を観測する実験。",
};

const timeline = [
  { date: "2025-01-01", label: "実験開始", status: "done" },
  { date: "2025-01-01", label: "LDOページ公開・JSON-LD実装", status: "done" },
  { date: "2025-01-01", label: "llms.txt設置（限定版）", status: "done" },
  { date: "進行中", label: "AIクローラー挙動の観測", status: "active" },
  { date: "未定", label: "「LDO」造語のAI反映確認", status: "pending" },
  { date: "未定", label: "中間レポート公開", status: "pending" },
];

export default function LDOExperimentPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ResearchProject",
            name: "EXP-004: LDO Validation Experiment",
            description:
              "An experiment to validate LDO (Licensable Data Optimization) by observing AI crawler behavior in response to structured concept data and a limited llms.txt implementation.",
            url: "https://www.geo-shock.com/experiments/ldo",
            status: "Active",
            startDate: "2025-01-01",
            publisher: {
              "@type": "Organization",
              name: "GEO Lab",
              url: "https://www.geo-shock.com",
            },
          }),
        }}
      />

      {/* ヘッダー */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono px-2 py-1 rounded bg-green-100 text-green-700">
            観測中
          </span>
          <span className="text-xs font-mono text-gray-400">EXP-004</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          LDO実験：LLMs.txtとAIデータ認識の観測
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          LDO（Licensable Data Optimization）という仮説的概念を提案し、
          llms.txtの限定的実装とあわせてAIクローラーの挙動変化を観測する実験です。
        </p>
      </header>

      {/* 実験目的 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">実験目的</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          本実験の目的は、<strong>LDO（Licensable Data Optimization）</strong>
          という新概念を提案し、その有効性を実験的に検証することです。
        </p>
        <p className="text-gray-700 leading-relaxed">
          特に、
          <strong>
            RSL（Really Simple
            Licensing）のようなAIデータライセンスの仕組みが普及した場合に備えた最適化
          </strong>
          という仮説を検証します。
        </p>
      </section>

      {/* 核心仮説 */}
      <section className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-3">
          Core Hypothesis
        </h2>
        <p className="text-gray-800 leading-relaxed">
          AI向けに明確に構造化された概念データは、将来的にライセンス対象データとして扱いやすくなる可能性がある。特に「明確な定義文」「用語体系」「構造化された概念ページ」は、AI理解しやすく・AI再利用しやすく・将来的にライセンス対象になりやすい可能性がある。
        </p>
      </section>

      {/* 実験設計 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6">実験設計</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">① LDOページの公開</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              LDOという新造語・新概念を、明確な定義文・Schema.org
              JSON-LD（DefinedTerm）・ライセンス宣言とともに公開します。
            </p>
            <a
              href="/terms/ldo"
              className="inline-block mt-2 text-sm underline text-blue-600"
            >
              → LDOページを見る
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-2">② llms.txtの限定的実装</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              通常のllms.txtはサイト全体の説明を書きますが、本実験では
              <strong>内容を意図的に限定</strong>します。記載するのは：
            </p>
            <ul className="text-sm text-gray-700 space-y-1 pl-4">
              <li>・ サイトがAI実験サイトであること</li>
              <li>・ LDOの説明と定義</li>
              <li>・ GEOショックの説明</li>
              <li>・ 関連ページURL</li>
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              理由：AIがどの情報を優先的に扱うかを観測するため。
            </p>
            <a
              href="/llms.txt"
              className="inline-block mt-2 text-sm underline text-blue-600"
              target="_blank"
            >
              → llms.txtを見る
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-2">③ 観測項目</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "llms.txtへのAIクローラーアクセスの有無",
                "LDOページのクロール頻度（導入前後比較）",
                "新規AIボットの出現",
                "「LDO」造語のAI回答への反映",
                "llms.txt記載情報とクロール挙動の相関",
              ].map((item) => (
                <div
                  key={item}
                  className="text-sm text-gray-700 flex gap-2 items-start"
                >
                  <span className="text-amber-500 shrink-0">→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 実験タイムライン */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6">実験タイムライン</h2>
        <div className="space-y-3">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4 items-center">
              <span className="text-xs font-mono text-gray-400 w-24 shrink-0">
                {item.date}
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.status === "done"
                    ? "bg-green-400"
                    : item.status === "active"
                      ? "bg-amber-400"
                      : "bg-gray-200"
                }`}
              />
              <span
                className={`text-sm ${item.status === "pending" ? "text-gray-400" : "text-gray-700"}`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* RSLとの関係 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">RSLとの関係</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          LDOはRSL（Really Simple
          Licensing）という概念と密接に関連しています。RSLはAI利用の条件を宣言する仕組みであり、将来的にAIデータ利用のライセンス基盤になる可能性があります。
        </p>
        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600">
          <strong>重要：</strong>{" "}
          これは確定した未来ではなく、「もしAIデータライセンスが普及した場合に有効になるかもしれない最適化」という仮説です。本実験はその仮説を検証するものです。
        </div>
      </section>

      {/* 他実験との関係 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">他実験との関係</h2>
        <p className="text-gray-700 leading-relaxed">
          EXP-004は、GEO実験・LLMs.txt実験・RSL仮説検証・新概念提案を統合した実験です。EXP-001（JSON-LD）・EXP-002（造語観測）の知見を活かしつつ、LDOという概念を軸に新しい観測軸を加えます。
        </p>
        <div className="mt-4 flex gap-3 flex-wrap">
          <a
            href="/experiments/exp-001"
            className="text-sm underline text-blue-600"
          >
            EXP-001
          </a>
          <a
            href="/experiments/exp-002"
            className="text-sm underline text-blue-600"
          >
            EXP-002
          </a>
          <a
            href="/experiments/exp-003"
            className="text-sm underline text-blue-600"
          >
            EXP-003
          </a>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>
          関連ページ：{" "}
          <a href="/terms/ldo" className="underline">
            LDOとは
          </a>{" "}
          /{" "}
          <a href="/terms/geo-shock" className="underline">
            GEOショック
          </a>{" "}
          /{" "}
          <a href="/llms.txt" className="underline" target="_blank">
            llms.txt
          </a>
        </p>
      </footer>
    </article>
  );
}
