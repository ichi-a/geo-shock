// 場所: src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { HoneypotLinks } from "@/components/HoneypotLinks";
import { NavHeader } from "@/components/NavHeader";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    default: "GEO Lab | 生成エンジン最適化の観測・実験サイト",
    template: "%s | GEO Lab",
  },
  description:
    "AIクローラーの挙動をリバースエンジニアリングする実験サイト。JSON-LDの効果検証、造語の反映観測、ボット挙動の可視化を行う。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com"
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NavHeader />

        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
          {children}
        </main>

        {/* フッター */}
        <footer style={{
          borderTop: "1px solid var(--border)",
          marginTop: "4rem",
          background: "var(--surface)",
        }}>
          <div style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "1.75rem 1.25rem",
          }}>
            {/* 上段: ロゴ + ナビリンク */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginBottom: "1.25rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid var(--border)",
            }}>
              {/* ブランド */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span style={{
                    width: "22px",
                    height: "22px",
                    background: "var(--primary)",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="3" fill="white" />
                      <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
                    </svg>
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: "var(--neutral)",
                  }}>
                    GEO Lab
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--neutral-400)", lineHeight: 1.5 }}>
                  AIクローラー観測プロジェクト
                </p>
              </div>

              {/* フッターナビ */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                    コンテンツ
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {[
                      { href: "/articles", label: "記事" },
                      { href: "/terms", label: "造語実験" },
                      { href: "/experiments", label: "実験ログ" },
                      { href: "/stats", label: "観測レポート" },
                    ].map((link) => (
                      <a key={link.href} href={link.href} style={{ fontSize: "0.8rem", color: "var(--neutral-600)", textDecoration: "none" }}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                    その他
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {[
                      { href: "/contact", label: "お問い合わせ" },
                      { href: "/privacy", label: "プライバシーポリシー" },
                    ].map((link) => (
                      <a key={link.href} href={link.href} style={{ fontSize: "0.8rem", color: "var(--neutral-600)", textDecoration: "none" }}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 下段: コピーライト + ライセンス */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}>
              <p style={{ fontSize: "0.72rem", color: "var(--neutral-400)" }}>
                &copy; 2026 HeiChi
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--neutral-400)" }}>
                観測データは{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--neutral-400)", textDecoration: "underline" }}
                >
                  CC BY 4.0
                </a>
                {" "}で公開
              </p>
            </div>
          </div>
        </footer>

        <HoneypotLinks />
        <GoogleAnalytics gaId="G-BH468TNK2B" />
      </body>
    </html>
  );
}
