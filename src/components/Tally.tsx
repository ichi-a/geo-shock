"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function ContactPage() {
  useEffect(() => {
    // ページに遷移してくるたびに Tally の埋め込みを再スキャンする
    // @ts-expect-error: Tally is loaded from an external script
    if (typeof window.Tally !== "undefined") {
      // @ts-expect-error: Tally is loaded from an external script
      window.Tally.loadEmbeds();
    }
  }, []);

  const app = "GEO_LAB";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* 導入テキスト */}
      <section style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "2rem",
        boxShadow: "var(--shadow-sm)",
        borderLeft: "4px solid var(--primary)",
      }}>

        <h1 style={{ fontSize: "1.5rem" }}>お問い合わせ</h1>
      </section>

      {/* Tally Embed エリア */}
      <section style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden", // iframeの角丸対応
        boxShadow: "var(--shadow-sm)",
      }}>
        <iframe
          data-tally-src={`https://tally.so/embed/EkQzWq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&app_name=${app}`}
          loading="lazy"
          width="60%"
          height="600" // 内容に合わせて調整
          title="GEO Lab Contact"
          style={{ width: "100%", border: "none"}}
          // 念のためのsandbox
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        ></iframe>
      </section>

      {/* フッター的な注釈 */}
      <p style={{ fontSize: "0.7rem", color: "var(--neutral-400)", textAlign: "center" }}>
        Powered by Tally. Privacy-focused data collection.
      </p>

      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error: Tally is loaded from an external script
          window.Tally?.loadEmbeds();
        }}
      />
    </div>
  );
}
