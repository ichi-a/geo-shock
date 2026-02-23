// 場所: src/components/Disclaimer.tsx

export function Disclaimer() {
  return (
    <div className="mt-10" style={{
      background: "var(--neutral-100)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      padding: "1rem 1.25rem",
      marginBottom: "1.75rem",
      fontSize: "0.8rem",
      color: "var(--neutral-400)",
      lineHeight: 1.7,
    }}>
      <strong style={{ color: "var(--neutral-600)" }}>免責事項:</strong>{" "}
      本記事はGEO Lab による独自の調査・解釈に基づいています。
      業界内での用語定義は統一されておらず、文脈によって異なる解釈が存在します。
      参考情報としてご活用ください。
    </div>
  );
}
