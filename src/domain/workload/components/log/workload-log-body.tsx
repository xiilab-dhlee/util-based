"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { terminalThemeAtom } from "@/shared/state/terminal.atom";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";
import { createTermBgClasses } from "@/styles/mixins/terminal";

const DEFAULT_THEME = "MaterialDark";

export function WorkloadLogBody() {
  const [selectedTheme] = useAtom(terminalThemeAtom);
  const currentTheme = selectedTheme || DEFAULT_THEME;

  return (
    <Container className={currentTheme}>
      {/* 워크로드 로그 */}
      <LogViewer
        className={currentTheme}
        data-testid={WORKLOAD_SELECTOR.LOG_VIEWER}
      >
        <LogLine data-testid={WORKLOAD_SELECTOR.LOG_LINE}>
          <LogTimestamp className={currentTheme}>
            [2024-01-15 10:30:15]
          </LogTimestamp>
          <LogMessage className={currentTheme}>
            INFO: 워크로드가 시작되었습니다.
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp className={currentTheme}>
            [2024-01-15 10:30:16]
          </LogTimestamp>
          <LogMessage className={currentTheme}>
            INFO: 컨테이너 초기화 중...
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp className={currentTheme}>
            [2024-01-15 10:30:17]
          </LogTimestamp>
          <LogMessage className={currentTheme}>
            INFO: 환경 변수 설정 완료
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp className={currentTheme}>
            [2024-01-15 10:30:18]
          </LogTimestamp>
          <LogMessage className={currentTheme}>
            INFO: 애플리케이션 시작
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp className={currentTheme}>
            [2024-01-15 10:30:19]
          </LogTimestamp>
          <LogMessage className={currentTheme}>
            WARN: 메모리 사용량이 높습니다 (85%)
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp className={currentTheme}>
            [2024-01-15 10:30:20]
          </LogTimestamp>
          <LogMessage className={currentTheme}>
            INFO: 요청 처리 중...
          </LogMessage>
        </LogLine>
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

const LogTimestamp = styled.span`
  white-space: nowrap;
  flex-shrink: 0;

  /* 기본 테마 - foreground 색상의 50% 밝기 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground}80;

  /* 테마별 타임스탬프 색상 (foreground의 50% 투명도) */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground}80;
      }
    `,
  )}
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
