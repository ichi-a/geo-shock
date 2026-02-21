// 場所: src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { HoneypotLinks } from "@/components/HoneypotLinks";
import { NavHeader } from "@/components/NavHeader";

export const metadata: Metadata = {
  title: {
    default: "GEO Lab | 生成エンジン最適化の観測・実験サイト",
    template: "%s | GEO Lab",
  },
  description:
    "AIクローラーの挙動をリバースエンジニアリングする実験サイト。JSON-LDの効果検証、造語の反映観測、ボット挙動の可視化を行う。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"
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

        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
          {children}
        </main>

        <footer style={{
          borderTop: "1px solid var(--border)",
          marginTop: "4rem",
          padding: "2rem 1.5rem",
          background: "var(--surface)",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 500, color: "var(--neutral)" }}>
                GEO Lab
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--neutral-400)", marginTop: "0.25rem" }}>
                AIクローラー観測プロジェクト
              </p>
            </div>
            <a href="/privacy" style={{ fontSize: "0.75rem", color: "var(--neutral-400)", textDecoration: "underline" }}>
              プライバシーポリシー
            </a>
            <a href="/contact" style={{ fontSize: "0.75rem", color: "var(--neutral-400)", textDecoration: "underline" }}>
              お問い合わせ
            </a>
            <small style={{ fontSize: "0.75rem", color: "var(--neutral-400)" }}>
              &copy; 2026 N-S
            </small>
          </div>
        </footer>

        <HoneypotLinks />
      </body>
    </html>
  );
}
