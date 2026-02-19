// ============================================
// 場所: app/api/cron/ask-ai/route.ts
// ============================================
// Vercel Cron Jobs から定期実行されるAPI。
// vercel.json で "0 9 * * *"（毎日9時）に設定する。
//
// 処理:
// 1. termsテーブルから造語一覧を取得
// 2. 各造語について複数パターンの質問を生成
// 3. OpenAI / Anthropic に投げて回答を取得
// 4. ai_responsesテーブルに保存
// ============================================

export const runtime = "nodejs";
export const maxDuration = 60; // 最大60秒（Vercel Pro以上）

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ---------- Cron認証（CRON_SECRET で保護） ----------
function authorizeCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

// ---------- 質問パターン生成 ----------
function buildPrompts(term: string): string[] {
  return [
    `「${term}」とは何ですか？定義を教えてください。`,
    `${term}について説明してください。`,
    `GEO Lab が定義した「${term}」という指標について知っていますか？`,
  ];
}

// ---------- OpenAI API 呼び出し ----------
async function askOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // コスト抑制のためminiを使用
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// ---------- Anthropic API 呼び出し ----------
async function askAnthropic(prompt: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // コスト抑制
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

// ---------- 定義との一致チェック ----------
function checkMatch(
  response: string | null,
  term: string,
  definition: string
): { matched: boolean; urlMentioned: boolean } {
  if (!response) return { matched: false, urlMentioned: false };

  const lowerResponse = response.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const lowerDef = definition.toLowerCase();

  // 造語名が含まれているか
  const termFound = lowerResponse.includes(lowerTerm);

  // 定義の重要キーワードが3語以上含まれているか
  const defKeywords = lowerDef
    .split(/[\s、。]/g)
    .filter((w) => w.length > 3);
  const matchCount = defKeywords.filter((kw) =>
    lowerResponse.includes(kw)
  ).length;
  const matched = termFound && matchCount >= 3;

  // URLへの言及
  const urlMentioned =
    lowerResponse.includes("geo-lab") ||
    lowerResponse.includes("geolab") ||
    lowerResponse.includes(
      process.env.NEXT_PUBLIC_SITE_URL?.toLowerCase() || "__nomatch__"
    );

  return { matched, urlMentioned };
}

// ---------- メインハンドラ ----------
export async function GET(request: NextRequest) {
  // Cron認証
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: {
    term: string;
    model: string;
    prompt: string;
    matched: boolean;
  }[] = [];

  try {
    // termsテーブルから造語一覧を取得
    const { data: terms, error: termsError } = await supabaseAdmin
      .from("terms")
      .select("*");

    if (termsError || !terms) {
      return NextResponse.json(
        { error: "Failed to fetch terms" },
        { status: 500 }
      );
    }

    for (const term of terms) {
      const prompts = buildPrompts(term.term);
      // 1造語につき最初の1プロンプトのみ（API費用節約）
      const prompt = prompts[0];

      const models: {
        name: string;
        fn: (p: string) => Promise<string | null>;
      }[] = [
        { name: "gpt-4o-mini", fn: askOpenAI },
        { name: "claude-haiku-4-5", fn: askAnthropic },
      ];

      for (const model of models) {
        const response = await model.fn(prompt);
        const { matched, urlMentioned } = checkMatch(
          response,
          term.term,
          term.description ?? ""
        );

        // ai_responsesに保存
        const { error: insertError } = await supabaseAdmin
          .from("ai_responses")
          .insert({
            term: term.term,
            model_name: model.name,
            prompt_text: prompt,
            response_text: response,
            matched_definition: matched,
            url_mentioned: urlMentioned,
            asked_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error(
            `[Cron] Insert error for ${term.term}/${model.name}:`,
            insertError
          );
        }

        results.push({ term: term.term, model: model.name, prompt, matched });

        // APIレート制限対策: 1秒待つ
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({
      ok: true,
      processed: results.length,
      results,
    });
  } catch (err) {
    console.error("[Cron] ask-ai error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
