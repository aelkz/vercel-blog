"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { Mermaid } from "@/components/mermaid";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  node?: any;
}

export function CodeBlock({ children, className, inline, node, ...props }: CodeBlockProps) {
  // Extract language from className (e.g., "language-bash" -> "bash")
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  // Check if this is actually a code block (pre > code) or inline code
  // Inline code doesn't have language class and is used within paragraphs
  const isCodeBlock = className?.includes("language-");

  // If it's inline code or no language specified, render simple code
  if (!isCodeBlock || inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // Handle mermaid diagrams
  if (language === "mermaid") {
    return <Mermaid chart={String(children).trim()} />;
  }

  // Minimal clean theme with light gray background
  const customTheme = {
    'code[class*="language-"]': {
      color: "#393A34",
      fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      fontSize: "0.75rem",
      textAlign: "left" as const,
      whiteSpace: "pre" as const,
      wordSpacing: "normal",
      wordBreak: "normal" as const,
      wordWrap: "normal" as const,
      lineHeight: "1.5",
      tabSize: 4,
      hyphens: "none" as const,
      background: "transparent",
    },
    'pre[class*="language-"]': {
      color: "#393A34",
      fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      fontSize: "0.75rem",
      textAlign: "left" as const,
      whiteSpace: "pre" as const,
      wordSpacing: "normal",
      wordBreak: "normal" as const,
      wordWrap: "normal" as const,
      lineHeight: "1.5",
      tabSize: 4,
      hyphens: "none" as const,
      padding: "1rem",
      margin: 0,
      overflow: "auto" as const,
      background: "#f5f5f5",
      borderRadius: "0.5rem",
    },
    comment: { color: "#008000", fontStyle: "italic" },
    prolog: { color: "#008000" },
    doctype: { color: "#008000" },
    cdata: { color: "#008000" },
    namespace: { opacity: 0.7 },
    string: { color: "#A31515" },
    punctuation: { color: "#393A34" },
    operator: { color: "#393A34" },
    url: { color: "#36acaa" },
    symbol: { color: "#36acaa" },
    number: { color: "#36acaa" },
    boolean: { color: "#36acaa" },
    variable: { color: "#36acaa" },
    constant: { color: "#36acaa" },
    inserted: { color: "#36acaa" },
    atrule: { color: "#0000ff" },
    keyword: { color: "#0000ff" },
    "attr-value": { color: "#0000ff" },
    ".language-autohotkey .token.selector": { color: "#0000ff" },
    ".language-json .token.boolean": { color: "#0000ff" },
    ".language-json .token.number": { color: "#0000ff" },
    deleted: { color: "#9a050f" },
    selector: { color: "#800000" },
    ".language-css .token.property": { color: "#800000" },
    ".language-css .token.function": { color: "#800000" },
    tag: { color: "#800000" },
    "attr-name": { color: "#ff0000" },
    property: { color: "#ff0000" },
    regex: { color: "#ff0000" },
    entity: { color: "#ff0000" },
    function: { color: "#393A34" },
    important: { color: "#e90", fontWeight: "bold" },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
  };

  return (
    <div className="code-block-wrapper my-2 overflow-hidden rounded-lg bg-[#f5f5f5] p-4">
      <SyntaxHighlighter language={language} style={customTheme} PreTag="div">
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}
