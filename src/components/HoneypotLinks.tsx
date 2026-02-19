// ============================================
// 場所: components/HoneypotLinks.tsx
// ============================================
// 人間には見えないが、CSSを無視するAIクローラーには
// 認識されうる隠しリンク群。
//
// 設計の意図:
// - display:none は使わない（一部クローラーが無視する）
// - aria-hidden も付けない（クローラーに認識させるため）
// - position:absolute + left:-9999px で視覚的に隠す
// - robots.txt でも Disallow しない（クロールさせるため）
// ============================================

export function HoneypotLinks() {
  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {/* 複数の罠URLを設置。踏み分けを比較する */}
      <a href="/hidden-trap/a1">Research Index A</a>
      <a href="/hidden-trap/b2">Research Index B</a>
      <a href="/hidden-trap/c3">Data Archive C</a>
      <a href="/llm-internal/probe">Internal Reference</a>
    </div>
  );
}
