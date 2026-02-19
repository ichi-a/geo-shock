// ============================================
// 場所: app/api/log/route.ts
// ============================================
// Node.js Runtime で動作（DNS検証のため）。
// middleware.ts からのfireアンドforget投げを受け取り、
// ボット判定・ハッシュ化・DB保存を行う。
// ============================================

export const runtime = "nodejs"; // DNS解決に Node.js が必要

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { analyzeBotRequest } from "@/lib/bot-detection";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      ip,
      ua,
      path,
      is_honeypot,
      asn,
      headers_json,
    }: {
      ip: string;
      ua: string;
      path: string;
      is_honeypot: boolean;
      asn: string | null;
      headers_json: Record<string, string>;
    } = body;

    // 入力バリデーション
    if (!ip || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ボット判定・ハッシュ化（lib/bot-detection.ts）
    const { ip_hash, bot_type, verification_level, asn: resolvedAsn } =
      await analyzeBotRequest({ ip, ua, asn });

    // Supabaseへ保存（サービスロール = RLSバイパス）
    const { error } = await supabaseAdmin.from("access_logs").insert({
      ip_hash,
      ua: ua || null,
      path,
      bot_type: bot_type || null,
      verification_level,
      is_honeypot: is_honeypot || false,
      asn: resolvedAsn || null,
      headers_json: headers_json || null,
    });

    if (error) {
      console.error("[GEO Lab] Supabase insert error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[GEO Lab] Log API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET は拒否
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
