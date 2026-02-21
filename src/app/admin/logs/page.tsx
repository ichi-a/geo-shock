// ============================================
// 場所: app/admin/logs/page.tsx
// ============================================
// AIクローラーアクセスログの管理ダッシュボード。
// サーバーコンポーネントで初期データ取得 +
// クライアントコンポーネントでRealtime更新。
// パスワード保護: ADMIN_PASSWORD 環境変数と照合。
// ============================================

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { LogsClient } from "@/components/admin/LogsClient";
import type { AccessLog } from "@/lib/supabase";

// 管理画面はインデックスさせない
export const metadata = {
  robots: { index: false, follow: false },
};

// サーバーサイドで認証チェック
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export default async function AdminLogsPage() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  // 初期データ取得（最新300件）
  const { data: logs, error } = await supabaseAdmin
    .from("access_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return (
      <div className="p-8 text-red-600">
        データ取得エラー: {error.message}
      </div>
    );
  }

  // 集計
  const stats = calcStats(logs as AccessLog[]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-mono">GEO Lab / Admin</h1>
            <p className="text-gray-400 text-sm mt-1">
              AIクローラーアクセスログ観測ダッシュボード
            </p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 px-3 py-1.5 rounded"
            >
              ログアウト
            </button>
          </form>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "総アクセス（直近300件）", value: logs?.length ?? 0 },
            { label: "確認済みボット", value: stats.confirmedBots },
            { label: "ハニーポット踏破", value: stats.honeypotHits },
            { label: "未判定（Level 0）", value: stats.unknowns },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <p className="text-xs text-gray-500 mb-1">{card.label}</p>
              <p className="text-2xl font-bold font-mono">{card.value}</p>
            </div>
          ))}
        </div>

        {/* ボット別集計 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">
            ボット別アクセス数
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.botCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([bot, count]) => (
                <span
                  key={bot}
                  className="text-xs bg-gray-800 border border-gray-700 rounded-full px-3 py-1"
                >
                  {bot || "不明"}: <strong>{count}</strong>
                </span>
              ))}
          </div>
        </div>

        {/* ログテーブル（Realtimeクライアントコンポーネント） */}
        {/*
          Supabase Realtimeの有効化方法:
          1. Supabaseダッシュボード → Database → Replication
          2. access_logs テーブルの INSERT を有効化
          3. LogsClient 内の useEffect で supabase.channel() を購読
        */}
        <LogsClient initialLogs={(logs as AccessLog[]) ?? []} />
      </div>
    </div>
  );
}

// ---------- 集計関数 ----------
function calcStats(logs: AccessLog[]) {
  const botCounts: Record<string, number> = {};
  let confirmedBots = 0;
  let honeypotHits = 0;
  let unknowns = 0;

  for (const log of logs) {
    const bot = log.bot_type || "human/unknown";
    botCounts[bot] = (botCounts[bot] || 0) + 1;
    if (log.verification_level >= 1) confirmedBots++;
    if (log.is_honeypot) honeypotHits++;
    if (log.verification_level === 0) unknowns++;
  }

  return { botCounts, confirmedBots, honeypotHits, unknowns };
}
