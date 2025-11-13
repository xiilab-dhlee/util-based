"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { terminalThemeAtom } from "@/atoms/common/terminal.atom";
import { MonitoringDrawer } from "@/components/common/drawer/monitoring-drawer";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";

export function WorkloadLogBody() {
  const [selectedTheme] = useAtom(terminalThemeAtom);

  return (
    <Container theme={selectedTheme || "theme-primary"}>
      {/* 모니터링 드로어 */}
      <MonitoringDrawer />
      {/* 워크로드 로그 */}
      <LogViewer theme={selectedTheme || "theme-primary"}>
        <LogLine>
          <LogTimestamp theme={selectedTheme || "theme-primary"}>
            [2024-01-15 10:30:15]
          </LogTimestamp>
          <LogMessage theme={selectedTheme || "theme-primary"}>
            INFO: 워크로드가 시작되었습니다.
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp theme={selectedTheme || "theme-primary"}>
            [2024-01-15 10:30:16]
          </LogTimestamp>
          <LogMessage theme={selectedTheme || "theme-primary"}>
            INFO: 컨테이너 초기화 중...
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp theme={selectedTheme || "theme-primary"}>
            [2024-01-15 10:30:17]
          </LogTimestamp>
          <LogMessage theme={selectedTheme || "theme-primary"}>
            INFO: 환경 변수 설정 완료
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp theme={selectedTheme || "theme-primary"}>
            [2024-01-15 10:30:18]
          </LogTimestamp>
          <LogMessage theme={selectedTheme || "theme-primary"}>
            INFO: 애플리케이션 시작
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp theme={selectedTheme || "theme-primary"}>
            [2024-01-15 10:30:19]
          </LogTimestamp>
          <LogMessage theme={selectedTheme || "theme-primary"}>
            WARN: 메모리 사용량이 높습니다 (85%)
          </LogMessage>
        </LogLine>
        <LogLine>
          <LogTimestamp theme={selectedTheme || "theme-primary"}>
            [2024-01-15 10:30:20]
          </LogTimestamp>
          <LogMessage theme={selectedTheme || "theme-primary"}>
            INFO: 요청 처리 중...
          </LogMessage>
        </LogLine>
      </LogViewer>
    </Container>
  );
}


const Container = styled.div<{ theme?: string }>`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;

  /* 기본 테마 (theme-primary) */
  background: #17171f;

  ${terminalDrawerStyle}

  /* 테마별 스타일 */
  ${({ theme }) => {
    switch (theme) {
      case "theme-secondary":
        return `
          background: #1e1e1e;
        `;
      case "theme-tertiary":
        return `
          background: #1f1d45;
        `;
      case "theme-quaternary":
        return `
          background: #fcf4dc;
          border: 1px solid #d5d5d5;
        `;
      case "theme-quinary":
        return `
          background: #eaeaea;
          border: 1px solid #d5d5d5;
        `;
      case "theme-senary":
        return `
          background: #f4f4f4;
          border: 1px solid #d5d5d5;
        `;
      default:
        return `
          background: #17171f;
        `;
    }
  }}
`;

const LogViewer = styled.div<{ theme?: string }>`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.5;

  /* 기본 테마 (theme-primary) */
  color: #ffffff;

  /* 테마별 스타일 */
  ${({ theme }) => {
    switch (theme) {
      case "theme-secondary":
        return `
          color: #ffffff;
        `;
      case "theme-tertiary":
        return `
          color: #ffffff;
        `;
      case "theme-quaternary":
        return `
          color: #17171f;
        `;
      case "theme-quinary":
        return `
          color: #17171f;
        `;
      case "theme-senary":
        return `
          color: #17171f;
        `;
      default:
        return `
          color: #ffffff;
        `;
    }
  }}
`;

const LogLine = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
  word-break: break-all;
`;

const LogTimestamp = styled.span<{ theme?: string }>`
  white-space: nowrap;
  flex-shrink: 0;

  /* 기본 테마 (theme-primary) */
  color: #888888;

  /* 테마별 스타일 */
  ${({ theme }) => {
    switch (theme) {
      case "theme-secondary":
        return `
          color: #888888;
        `;
      case "theme-tertiary":
        return `
          color: #888888;
        `;
      case "theme-quaternary":
        return `
          color: #666666;
        `;
      case "theme-quinary":
        return `
          color: #666666;
        `;
      case "theme-senary":
        return `
          color: #666666;
        `;
      default:
        return `
          color: #888888;
        `;
    }
  }}
`;

const LogMessage = styled.span<{ theme?: string }>`
  flex: 1;

  /* 기본 테마 (theme-primary) */
  color: #ffffff;

  /* 테마별 스타일 */
  ${({ theme }) => {
    switch (theme) {
      case "theme-secondary":
        return `
          color: #ffffff;
        `;
      case "theme-tertiary":
        return `
          color: #ffffff;
        `;
      case "theme-quaternary":
        return `
          color: #17171f;
        `;
      case "theme-quinary":
        return `
          color: #17171f;
        `;
      case "theme-senary":
        return `
          color: #17171f;
        `;
      default:
        return `
          color: #ffffff;
        `;
    }
  }}
`;
