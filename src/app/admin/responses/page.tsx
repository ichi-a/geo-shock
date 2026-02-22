// ============================================
// 場所: app/admin/responses/page.tsx
// ============================================
// cronジョブが保存したAI回答ログを閲覧するページ。
// 造語の反映状況を一覧で確認できる。
// ============================================

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import type { AiResponse } from "@/lib/supabase";

export const metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export default async function AdminResponsesPage() {
  const isAuthed = await checkAuth();
  if (!isAuthed) redirect("/admin/login");

  const { data: responses, error } = await supabaseAdmin
    .from("ai_responses")
    .select("*")
    .order("asked_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="p-8 text-red-400">
        データ取得エラー: {error.message}
      </div>
    );
  }

  const logs = (responses as AiResponse[]) ?? [];

  // 造語別・モデル別の集計
  const summary: Record<
    string,
    { total: number; matched: number; urlMentioned: number }
  > = {};
  for (const r of logs) {
    const key = `${r.term} / ${r.model_name}`;
    if (!summary[key]) summary[key] = { total: 0, matched: 0, urlMentioned: 0 };
    summary[key].total++;
    if (r.matched_definition) summary[key].matched++;
    if (r.url_mentioned) summary[key].urlMentioned++;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-mono">AI回答ログ</h1>
            <p className="text-gray-400 text-sm mt-1">
              造語の生成AI反映状況
            </p>
          </div>
          <a
            href="/admin/logs"
            className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 px-3 py-1.5 rounded"
          >
            ← クロールログへ
          </a>
        </div>

        {/* 集計サマリー */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">
            造語別 反映率サマリー
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                  <th className="text-left px-3 py-2">造語 / モデル</th>
                  <th className="text-right px-3 py-2">質問回数</th>
                  <th className="text-right px-3 py-2">定義一致</th>
                  <th className="text-right px-3 py-2">反映率</th>
                  <th className="text-right px-3 py-2">URL言及</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary).map(([key, s]) => (
                  <tr
                    key={key}
                    className="border-b border-gray-800/50"
                  >
                    <td className="px-3 py-2 text-gray-300">{key}</td>
                    <td className="px-3 py-2 text-right font-mono">{s.total}</td>
                    <td className="px-3 py-2 text-right font-mono text-green-400">
                      {s.matched}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      <span
                        className={
                          s.matched / s.total > 0.5
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {s.total > 0
                          ? Math.round((s.matched / s.total) * 100)
                          : 0}
                        %
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-blue-400">
                      {s.urlMentioned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 詳細ログ */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400">詳細ログ</h2>
          {logs.map((r) => (
            <div
              key={r.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 border border-cyan-800 px-2 py-0.5 rounded">
                    {r.term}
                  </span>
                  <span className="text-xs text-gray-500">/</span>
                  <span className="text-xs text-gray-400">{r.model_name}</span>
                  {r.matched_definition && (
                    <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded">
                      ✓ 定義一致
                    </span>
                  )}
                  {r.url_mentioned && (
                    <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-800 px-2 py-0.5 rounded">
                      🔗 URL言及
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap font-mono">
                  {new Date(r.asked_at).toLocaleString("ja-JP")}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                Q: {r.prompt_text}
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
                {r.response_text || "（回答なし）"}
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-12 text-gray-600 text-sm">
              回答ログなし。Cronジョブが実行されるまで待ってください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
