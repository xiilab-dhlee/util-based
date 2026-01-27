"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import type { SseEmitter } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { terminalThemeAtom } from "@/shared/state/terminal.atom";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";
import { createTermBgClasses } from "@/styles/mixins/terminal";

const DEFAULT_THEME = "MaterialDark";

interface WorkloadLogBodyProps {
  /** 로그 데이터 (Active: SseEmitter, Terminated: Blob) */
  logData: SseEmitter | Blob | undefined;
  /** 로딩 상태 */
  isLoading: boolean;
}

export function WorkloadLogBody({ logData, isLoading }: WorkloadLogBodyProps) {
  const [selectedTheme] = useAtom(terminalThemeAtom);
  const currentTheme = selectedTheme || DEFAULT_THEME;

  // TODO: logData 파싱 및 렌더링 로직 구현 필요
  // - Active 로그: SseEmitter (SSE 스트림)
  // - Terminated 로그: Blob (텍스트 파일)

  return (
    <Container className={currentTheme}>
      {/* 워크로드 로그 */}
      <LogViewer
        className={currentTheme}
        data-testid={WORKLOAD_SELECTOR.LOG_VIEWER}
      >
        {isLoading ? (
          <LogLine>
            <LogMessage className={currentTheme}>로딩 중...</LogMessage>
          </LogLine>
        ) : logData ? (
          <LogLine data-testid={WORKLOAD_SELECTOR.LOG_LINE}>
            <LogMessage className={currentTheme}>
              {/* TODO: 실제 로그 데이터 파싱 후 표시 */}
              로그 데이터가 있습니다.
            </LogMessage>
          </LogLine>
        ) : (
          <LogLine>
            <LogMessage className={currentTheme}>
              로그 데이터가 없습니다.
            </LogMessage>
          </LogLine>
        )}
      </LogViewer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;

  /* 기본 테마 */
  background: ${TERMINAL_THEME_LIST[DEFAULT_THEME].background};

  ${terminalDrawerStyle}
  ${createTermBgClasses()}
`;

const LogViewer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.5;

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

const LogLine = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
  word-break: break-all;
`;

const LogMessage = styled.span`
  flex: 1;

  /* 기본 테마 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground};

  /* 테마별 메시지 색상 */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground};
      }
    `,
  )}
`;
