"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/articles",    label: "記事" },
  { href: "/terms",       label: "造語実験" },
  { href: "/experiments", label: "実験ログ" },
  { href: "/stats",       label: "観測レポート" },
];

export function NavHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header style={{
      borderBottom: "1px solid var(--border)",
      background: "var(--surface)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 1px 0 var(--border), var(--shadow-sm)",
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
      }}>
        {/* ロゴ */}
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            width: "26px",
            height: "26px",
            background: "var(--primary)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="white" />
              <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
            </svg>
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            fontSize: "0.95rem",
            color: "var(--neutral)",
            letterSpacing: "-0.01em",
          }}>
            GEO Lab
          </span>
        </a>

        {/* PC用ナビ（sm以上で表示） */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--primary)" : "var(--neutral-600)",
                  textDecoration: "none",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  background: active ? "var(--primary-light)" : "transparent",
                  position: "relative",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
                {active && (
                  <span style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "20px",
                    height: "2px",
                    background: "var(--primary)",
                    borderRadius: "2px",
                  }} />
                )}
              </a>
            );
          })}
        </nav>

        {/* ハンバーガーボタン（sm未満で表示） */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex sm:hidden flex-col justify-center gap-1"
          aria-label="メニュー"
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.45rem 0.55rem",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "block", width: "18px", height: "1.5px", background: "var(--neutral)", borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(0px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "18px", height: "1.5px", background: "var(--neutral)", borderRadius: "2px", transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "18px", height: "1.5px", background: "var(--neutral)", borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(0px, -5px)" : "none" }} />
        </button>
      </div>

      {/* SP用メニュー（sm未満でmenuOpenのときだけ表示） */}
      {menuOpen && (
        <div className="sm:hidden" style={{
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
          padding: "0.5rem 1.25rem 1rem",
        }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--primary)" : "var(--neutral-600)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {active && (
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    flexShrink: 0,
                  }} />
                )}
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
