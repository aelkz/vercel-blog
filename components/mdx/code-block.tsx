"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

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

  // Custom coffee-themed style based on tomorrow theme
  const customStyle = {
    ...tomorrow,
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      background: "hsl(33, 30%, 76%)", // D2C0AA - light beige
      border: "1px solid hsl(42, 49%, 56%)", // CA9F55 - medium brown
      borderRadius: "0.5rem",
      padding: "1rem",
    },
    'code[class*="language-"]': {
      ...tomorrow['code[class*="language-"]'],
      color: "hsl(33, 63%, 25%)", // Dark brown for text
      background: "transparent",
      fontSize: "0.75rem",
    },
  };

  return (
    <SyntaxHighlighter
      language={language}
      style={customStyle}
      PreTag="div"
      customStyle={{
        margin: 0,
        background: "hsl(33, 30%, 76%)",
        border: "1px solid hsl(42, 49%, 56%)",
        borderRadius: "0.5rem",
        padding: "1rem",
      }}
      codeTagProps={{
        style: {
          color: "hsl(33, 63%, 25%)",
          fontSize: "0.75rem",
        },
      }}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}
