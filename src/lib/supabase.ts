// ============================================
// 場所: lib/supabase.ts
// ============================================
// サーバーサイド（サービスロール）とクライアントサイド（anon）の
// Supabaseクライアントを提供する。
// ============================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// クライアントサイド用（anon key）
// ブラウザから直接使用。RLSポリシーが適用される。
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// サーバーサイド用（service role key）
// Route Handler / Server Actions でのみ使用。
// RLSをバイパスするため、クライアントサイドには絶対に渡さない。
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ---------- 型定義 ----------
export type AccessLog = {
  id: number;
  created_at: string;
  ip_hash: string;
  ua: string | null;
  path: string;
  bot_type: string | null;
  verification_level: number;
  is_honeypot: boolean;
  asn: string | null;
  headers_json: Record<string, string> | null;
};

export type Term = {
  id: number;
  created_at: string;
  term: string;
  page_path_a: string;
  page_path_b: string;
  published_at: string;
  description: string | null;
};

export type AiResponse = {
  id: number;
  created_at: string;
  asked_at: string;
  term: string;
  model_name: string;
  prompt_text: string;
  response_text: string | null;
  matched_definition: boolean | null;
  confidence_score: number | null;
  url_mentioned: boolean | null;
  notes: string | null;
};
