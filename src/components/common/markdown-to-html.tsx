"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

interface MarkdownToHtmlProps {
  markdown: string;
}

export function MarkdownToHtml({ markdown }: MarkdownToHtmlProps) {
  return (
    <StyledMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            // 코드 (```)
            <SyntaxHighlighter style={nord} language={match[1]} PreTag="div">
              {String(children)
                .replace(/\n$/, "")
                .replace(/\n&nbsp;\n/g, "")
                .replace(/\n&nbsp\n/g, "")}
            </SyntaxHighlighter>
          ) : (
            <SyntaxHighlighter
              style={nord}
              background="green"
              language="textile"
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {markdown}
    </StyledMarkdown>
  );
}


const StyledMarkdown = styled(ReactMarkdown)`
  font-size: 12px;

  pre * {
    font-family: inherit;
  }

  *:not(p, ol, ul) {
    margin-bottom: 10px;
  }

  h1,
  p {
    margin-bottom: 14px;
    line-height: 16px;
  }

  /* 순서 있는 목록 스타일 */
  ol {
    list-style-type: decimal;
    padding-left: 1em;
  }

  ol li {
    display: list-item;
    list-style-position: outside;
    margin-bottom: 0;
  }

  /* 순서 없는 목록 스타일 */
  ul {
    list-style-type: disc;
    padding-left: 1em;
  }

  ul li {
    display: list-item;
    list-style-position: outside;
    margin-bottom: 0;
  }

  li p {
    margin-bottom: 0;
  }

  ol + ul {
    padding-left: 2em;
  }

  ol + *:not(ul, p) {
    margin-top: 14px;
  }

  ul + *:not(ol) {
    margin-top: 14px;
  }

  /* 테이블 */
  thead tr {
    border-bottom: 2px solid rgba(46, 52, 64, 0.2);
  }

  tbody tr {
    border-bottom: 1px dashed #c6cbd1;
  }

  th,
  td {
    padding: 6px 13px;
  }
`;
