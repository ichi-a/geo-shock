// ============================================
// 場所: app/robots.ts
// ============================================
// Next.js の MetadataRoute で robots.txt を動的生成。
//
// 設計の意図:
// - AIクローラーは全て許可（観測のため）
// - ハニーポットは Disallow しない（踏ませるため）
// - 管理画面は Disallow
// - /terms/geo-shock-index-b（noindex設定済み）は Disallow しない
//   → AIクローラーに来訪してほしいため
// ============================================

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

  return {
    rules: [
      // 全クローラーへの基本ルール
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",        // 管理画面
          "/api/",          // APIエンドポイント
        ],
      },
      // AIクローラーには追加で全ページを許可（明示的に許可意思を示す）
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
