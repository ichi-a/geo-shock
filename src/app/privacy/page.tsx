import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー — GEO Lab",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl">
      <h1>プライバシーポリシー</h1>
      <p className="text-sm text-gray-500 mt-2 mb-8">最終更新: 2025年1月1日</p>

      <h2>収集する情報</h2>
      <p>GEO Lab（以下「当サイト」）は、研究目的でアクセスログを収集します。収集する情報は以下のとおりです。</p>
      <ul>
        <li>アクセス日時</li>
        <li>IPアドレスのハッシュ値（SHA-256 + サーバーサイドソルト。生のIPは保存しません）</li>
        <li>User-Agent文字列</li>
        <li>アクセスしたURL</li>
        <li>自律システム番号（ASN）</li>
        <li>一部のHTTPヘッダー情報</li>
      </ul>

      <h2>収集しない情報</h2>
      <ul>
        <li>生のIPアドレス（即時ハッシュ化し、原文は保存しません）</li>
        <li>氏名・メールアドレス等の個人識別情報</li>
        <li>Cookie・セッション情報</li>
      </ul>

      <h2>利用目的</h2>
      <p>収集したデータは、AIクローラーの挙動観測・研究目的に使用します。</p>

      <h2>データの取り扱い</h2>
      <p>データはSupabase（米国）のサーバーに保存されます。個人の特定・プロファイリング・他データとの照合は行いません。</p>

      <h2>お問い合わせ</h2>
      <p>データの削除依頼・お問い合わせは、サイト管理者までご連絡ください。</p>
    </article>
  );
}
