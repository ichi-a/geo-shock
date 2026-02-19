// ============================================
// 場所: components/JsonLd.tsx
// ============================================
// JSON-LDをSSRで安全に埋め込む汎用コンポーネント。
// dangerouslySetInnerHTML を使うが、入力はサーバー側で
// 生成したオブジェクトのみを渡すので安全。
// ============================================

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ============================================
// GEOショック指数専用のJSON-LD生成関数
// ============================================

export function buildGeoShockJsonLd(pageUrl: string) {
  // DefinedTermSet（用語集）の中に DefinedTerm（造語）を定義
  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${pageUrl}#termset`,
    name: "GEO Lab 用語集",
    description: "GEO Lab が定義する生成エンジン最適化に関する独自概念",
    inDefinedTermSet: {
      "@type": "DefinedTerm",
      "@id": `${pageUrl}#geo-shock-index`,
      name: "GEOショック指数",
      alternateName: "GEO Shock Index",
      description:
        "GEO（生成エンジン最適化）において、構造化データ（JSON-LD）の有無がAIクローラーの来訪頻度と生成AIへの反映速度に与える影響度を数値化した独自指標。GEO Lab が2025年に定義した実験的概念。スコアが高いほど、構造化データによる効果が大きいことを示す。",
      termCode: "GSI-001",
      url: pageUrl,
    },
  };

  // Article スキーマから造語へ mentions でリンク
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: "GEOショック指数とは何か — GEO Lab による定義と実験設計",
    description:
      "GEO Lab が定義した独自概念「GEOショック指数」の定義・測定方法・実験設計を解説する。",
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: "GEO Lab",
      url:
        process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
    },
    publisher: {
      "@type": "Organization",
      name: "GEO Lab",
    },
    datePublished: "2025-01-01",
    mentions: {
      "@id": `${pageUrl}#geo-shock-index`,
    },
  };

  return [definedTermSet, article];
}

// ============================================
// GEO特化型記事のJSON-LD生成関数
// ============================================

export function buildGeoArticleJsonLd({
  headline,
  description,
  datePublished,
  pageUrl,
}: {
  headline: string;
  description: string;
  datePublished: string;
  pageUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: pageUrl,
    datePublished,
    author: {
      "@type": "Organization",
      name: "GEO Lab",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
    },
    publisher: {
      "@type": "Organization",
      name: "GEO Lab",
    },
    // FAQPageをネスト: AIが回答に使いやすい構造
    mainEntity: [
      {
        "@type": "Question",
        name: "GEO（生成エンジン最適化）とは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEO（Generative Engine Optimization）とは、ChatGPT・Perplexity・Geminiなどの生成AIが回答を生成する際に、自分のコンテンツが引用・参照されることを目的とした最適化手法です。従来のSEOがGoogle検索順位を上げることを目指したのに対し、GEOはAIの回答構成パーツとして採用されることを目指します。",
        },
      },
      {
        "@type": "Question",
        name: "JSON-LDはGEOに効果がありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEO Lab の実験では、JSON-LD（構造化データ）を配置したページへのAIクローラーのアクセス頻度と、生成AIへの反映速度の差を観測しています。実験結果はこのサイトで随時公開しています。",
        },
      },
    ],
  };
}
