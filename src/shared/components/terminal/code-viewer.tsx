"use client";

import { Spin } from "antd";
import styled from "styled-components";

import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { createTermBgClasses } from "@/styles/mixins/terminal";

const DEFAULT_THEME = "MaterialDark";

interface CodeViewerProps {
  content: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

/**
 * 코드/YAML/텍스트를 터미널 스타일로 표시하는 컴포넌트
 * - Describe, YAML 모달에서 공통으로 사용
 */
export function CodeViewer({
  content,
  isLoading,
  isError,
  errorMessage = TABLE_MESSAGE.ERROR,
}: CodeViewerProps) {
  const currentTheme = DEFAULT_THEME;

  if (isLoading) {
    return (
      <Container className={currentTheme}>
        <LoadingContainer className={currentTheme}>
          <Spin size="large" />
        </LoadingContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className={currentTheme}>
        <ContentViewer className={currentTheme}>
          <ErrorText className={currentTheme}>{errorMessage}</ErrorText>
        </ContentViewer>
      </Container>
    );
  }

  if (content === "") {
    return (
      <Container className={currentTheme}>
        <ContentViewer className={currentTheme}>
          <CodeContent className={currentTheme}>
            {TABLE_MESSAGE.EMPTY}
          </CodeContent>
        </ContentViewer>
      </Container>
    );
  }
  return (
    <Container className={currentTheme}>
      <ContentViewer className={currentTheme}>
        <CodeContent className={currentTheme}>{content}</CodeContent>
      </ContentViewer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;

  /* 기본 테마 */
  background: ${TERMINAL_THEME_LIST[DEFAULT_THEME].background};

  ${createTermBgClasses()}
`;

const ContentViewer = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
  font-size: 13px;
  line-height: 1.6;

  /* 기본 테마 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground};

  /* 테마별 텍스트 색상 */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground};
      }
    `,
  )}
`;

const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 기본 테마 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground};

  /* 테마별 스피너 색상 */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground};
      }
    `,
  )}

  .ant-spin-dot-item {
    background-color: currentColor;
  }
`;

const CodeContent = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;

  /* 기본 테마 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground};

  /* 테마별 코드 색상 */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground};
      }
    `,
  )}
`;

const ErrorText = styled.span`
  color: #ff6b6b;
`;
