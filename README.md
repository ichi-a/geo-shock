# GEO Lab — 全体ファイル構成・セットアップガイド

AIクローラーの挙動を観測・記録するNext.js製実験サイト。

---

## 完全なファイル構成

```
geo-lab/
│
├── .env.local.example            # 環境変数テンプレート
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                   # Vercel Cron設定（毎日9時）
│
├── middleware.ts                 # [第1回] Edgeで全アクセス捕捉
│
├── supabase/
│   └── schema.sql                # [第1回] DBスキーマ
│
├── lib/
│   ├── bot-detection.ts          # [第1回] ボット判定・DNS検証
│   └── supabase.ts               # [第1回] クライアント・型定義
│
├── components/
│   ├── HoneypotLinks.tsx         # [第2回] 隠しリンク
│   ├── JsonLd.tsx                # [第2回] JSON-LD生成
│   └── admin/
│       └── LogsClient.tsx        # [第3回] Realtimeログテーブル
│
└── app/
    ├── layout.tsx                # [第2回] ルートレイアウト
    ├── globals.css               # [第2回] Tailwindスタイル
    ├── page.tsx                  # [第2回] トップページ
    ├── robots.ts                 # [第3回] robots.txt生成
    ├── sitemap.ts                # [第3回] sitemap.xml生成
    │
    ├── articles/
    │   ├── what-is-geo/
    │   │   └── page.tsx          # [第2回] GEO特化型記事（JSON-LDあり）
    │   ├── why-jsonld-matters/
    │   │   └── page.tsx          # [第2回] GEO特化型記事（FAQPage）
    │   └── ai-and-content-creators/
    │       └── page.tsx          # [第2回] 人間向けデコイ記事（JSON-LDなし）
    │
    ├── terms/
    │   ├── geo-shock-index-a/
    │   │   └── page.tsx          # [第2回] 造語ページA（JSON-LDあり・実験群）
    │   └── geo-shock-index-b/
    │       └── page.tsx          # [第2回] 造語ページB（JSON-LDなし・対照群）
    │
    ├── experiments/
    │   └── page.tsx              # [第2回] 実験ログ公開ページ
    │
    ├── privacy/
    │   └── page.tsx              # [第2回] プライバシーポリシー
    │
    ├── hidden-trap/
    │   └── [id]/page.tsx         # [第2回] ハニーポットターゲット
    │
    ├── llm-internal/
    │   └── probe/page.tsx        # [第2回] ハニーポットターゲット2
    │
    ├── admin/
    │   ├── login/page.tsx        # [第3回] 管理者ログイン
    │   ├── logs/page.tsx         # [第3回] クロールログダッシュボード
    │   └── responses/page.tsx    # [第3回] AI回答ログビューア
    │
    └── api/
        ├── log/route.ts          # [第1回] ログ受信・保存（Node Runtime）
        ├── admin/
        │   ├── login/route.ts    # [第3回] ログイン処理
        │   └── logout/route.ts   # [第3回] ログアウト処理
        └── cron/
            └── ask-ai/route.ts   # [第3回] AI定期質問cronジョブ
```

---

## セットアップ手順（最初から）

### Step 1: Supabase

1. [supabase.com](https://supabase.com) でプロジェクト作成
2. SQL Editor → `supabase/schema.sql` を実行
3. Database → Replication → `access_logs` の INSERT をオン（Realtime有効化）
4. Project Settings → API から以下をコピー:
   - Project URL
   - anon key
   - service_role key

### Step 2: 環境変数

```bash
cp .env.local.example .env.local
```

`.env.local` を編集:

```
NEXT_PUBLIC_SUPABASE_URL=      # SupabaseのURL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # anon key
SUPABASE_SERVICE_ROLE_KEY=     # service_role key（サーバー専用）
LOG_SALT=                      # ランダム文字列（下記コマンドで生成）
NEXT_PUBLIC_SITE_URL=          # 本番URL（例: https://geo-lab.example.com）
OPENAI_API_KEY=                # OpenAI（cronジョブ用）
ANTHROPIC_API_KEY=             # Anthropic（cronジョブ用）
ADMIN_PASSWORD=                # 管理画面パスワード（任意の文字列）
CRON_SECRET=                   # Cronジョブ認証トークン（任意の文字列）
```

LOG_SALT生成:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: インストール・起動

```bash
npm install
npm run dev
```

### Step 4: Vercelデプロイ

```bash
npm install -g vercel
vercel
```

Vercelダッシュボード → Settings → Environment Variables に
`.env.local` の内容を全て設定する。

Cron Jobsは `vercel.json` の設定で自動的に有効化される（毎日9時UTC）。

---

## 実験設計の全体像

```
観測対象1: クロールログ
  middleware.ts（Edge）
    → /api/log（Node）
      → bot-detection.ts でUA/ASN/DNS判定
        → Supabase access_logs
          → /admin/logs でリアルタイム確認

観測対象2: 造語の反映
  vercel.json（毎日9時）
    → /api/cron/ask-ai
      → OpenAI / Anthropic に質問投下
        → 回答を Supabase ai_responses に保存
          → /admin/responses で反映率確認

ハニーポット:
  HoneypotLinks.tsx（全ページに埋め込み）
    → /hidden-trap/* → middleware が is_honeypot:true でログ
```

---

## 実験ページの役割一覧

| ページ | URL | JSON-LD | 実験上の役割 |
|--------|-----|---------|------------|
| 造語A | /terms/geo-shock-index-a | あり | 実験群（canonical） |
| 造語B | /terms/geo-shock-index-b | なし | 対照群（noindex） |
| GEO記事1 | /articles/what-is-geo | Article+FAQ | 実験群 |
| GEO記事2 | /articles/why-jsonld-matters | FAQPage | 実験群 |
| デコイ記事 | /articles/ai-and-content-creators | なし | 対照群 |
| 実験ログ | /experiments | Dataset | 公開観測レポート |

---

## 管理画面URL

| URL | 内容 |
|-----|------|
| /admin/login | ログイン（ADMIN_PASSWORDで認証） |
| /admin/logs | クロールログ一覧（Realtime） |
| /admin/responses | AI回答ログ・反映率 |

---

## 観測できること・できないこと

| 項目 | 可否 | 手段 |
|------|------|------|
| AIクローラーの来訪 | ✅ | middleware + Supabase |
| ボットの種別・検証レベル | ✅ | UA/ASN/DNS判定 |
| ハニーポット踏破 | ✅ | is_honeypot フラグ |
| 造語のAI回答への反映 | ✅（手動/自動） | cronジョブ |
| 引用の正確な回数 | ❌ | キャッシュされるため不可能 |
| JSON-LDとクロールの因果 | ⚠️ | 相関は見えるが因果証明は困難 |

---

## 注意事項

- `SUPABASE_SERVICE_ROLE_KEY` は絶対にクライアントサイドに渡さない
- `LOG_SALT` を変更すると過去のip_hashと突合不能になる
- Vercel Cron は Hobby プランでも動作するが、`maxDuration: 60` はPro以上が必要
  → Hobbyの場合は `maxDuration` を10に変更すること
- cronジョブのAPI費用: gpt-4o-mini + claude-haiku で1回あたり約$0.001未満
