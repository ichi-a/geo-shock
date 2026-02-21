// ============================================
// 場所: components/admin/LogsClient.tsx
// ============================================
// "use client" コンポーネント。
// Supabase Realtimeで新着ログをリアルタイム受信する。
// 検証レベルを色分け表示。
// ============================================

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { AccessLog } from "@/lib/supabase";

// クライアント用Supabaseインスタンス（anon key使用）
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  initialLogs: AccessLog[];
};

// 検証レベルのバッジ色
const LEVEL_STYLE: Record<number, string> = {
  0: "bg-gray-800 text-gray-400 border-gray-700",
  1: "bg-yellow-900 text-yellow-400 border-yellow-700",
  2: "bg-blue-900 text-blue-400 border-blue-700",
  3: "bg-green-900 text-green-400 border-green-700",
};
const LEVEL_LABEL: Record<number, string> = {
  0: "L0 未判定",
  1: "L1 UA一致",
  2: "L2 ASN照合",
  3: "L3 DNS検証",
};

export function LogsClient({ initialLogs }: Props) {
  const [logs, setLogs] = useState<AccessLog[]>(initialLogs);
  const [isLive, setIsLive] = useState(false);
  const [filter, setFilter] = useState<"all" | "bot" | "honeypot">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Supabase Realtime の購読
    // 有効化手順:
    //   Supabase Dashboard → Database → Replication →
    //   access_logs テーブルの INSERT をオン
    const channel = supabaseClient
      .channel("access_logs_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "access_logs" },
        (payload) => {
          const newLog = payload.new as AccessLog;
          setLogs((prev) => [newLog, ...prev].slice(0, 200)); // 最大200件
          setIsLive(true);
          // 3秒後にライブインジケーターを消す
          setTimeout(() => setIsLive(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  // フィルタリング
  const filtered = logs.filter((log) => {
    if (filter === "bot" && !log.bot_type) return false;
    if (filter === "honeypot" && !log.is_honeypot) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.ua?.toLowerCase().includes(q) ||
        log.path?.toLowerCase().includes(q) ||
        log.bot_type?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* コントロールバー */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-green-400 animate-pulse" : "bg-gray-600"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isLive ? "LIVE" : "Realtime接続中"}
          </span>
        </div>

        <div className="flex gap-2 ml-auto">
          {(["all", "bot", "honeypot"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded border ${
                filter === f
                  ? "bg-white text-black border-white"
                  : "text-gray-400 border-gray-700 hover:border-gray-500"
              }`}
            >
              {f === "all" ? "全て" : f === "bot" ? "ボットのみ" : "🪤 ハニーポット"}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="UA / パス / ボット名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 w-52 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* ログテーブル */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-4 py-3 font-medium">日時</th>
                <th className="text-left px-4 py-3 font-medium">ボット名</th>
                <th className="text-left px-4 py-3 font-medium">検証レベル</th>
                <th className="text-left px-4 py-3 font-medium">パス</th>
                <th className="text-left px-4 py-3 font-medium">ASN</th>
                <th className="text-left px-4 py-3 font-medium">IP Hash</th>
                <th className="text-left px-4 py-3 font-medium">罠</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-600">
                    ログなし
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-2.5 font-mono text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toISOString().replace("T", " ").slice(0, 19)}
                    </td>
                    <td className="px-4 py-2.5">
                      {log.bot_type ? (
                        <span className="text-cyan-400 font-medium">
                          {log.bot_type}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block border rounded-full px-2 py-0.5 text-xs ${
                          LEVEL_STYLE[log.verification_level] ||
                          LEVEL_STYLE[0]
                        }`}
                      >
                        {LEVEL_LABEL[log.verification_level] || "不明"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-300 max-w-xs truncate">
                      {log.path}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 font-mono">
                      {log.asn || "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600 max-w-xs">
                      {log.ip_hash?.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {log.is_honeypot ? (
                        <span title="ハニーポット踏破">🪤</span>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3">
        表示: {filtered.length} / {logs.length} 件
      </p>
    </div>
  );
}
