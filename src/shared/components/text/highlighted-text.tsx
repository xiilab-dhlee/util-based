import styled from "styled-components";

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

/**
 * 검색어와 일치하는 부분을 하이라이트 처리하는 컴포넌트
 */
export function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Highlight key={index}>{part}</Highlight>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * 정규표현식 특수문자 이스케이프
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const Highlight = styled.mark`
  background-color: #fff3cd;
  color: inherit;
  padding: 0;
`;
