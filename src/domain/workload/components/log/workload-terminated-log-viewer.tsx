"use client";

import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useGetTerminatedWorkloadLog } from "@/api/generated/workload/workload";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { terminalThemeAtom } from "@/shared/state/terminal.atom";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";
import { createTermBgClasses } from "@/styles/mixins/terminal";

const DEFAULT_THEME = "MaterialDark";

interface WorkloadTerminatedLogViewerProps {
  workspaceId: number;
  workloadResourceName: string;
}

/**
 * 종료된 워크로드 로그 뷰어 컴포넌트
 *
 * TERMINATED 상태의 워크로드 로그를 Blob으로 조회하여 표시합니다.
 */
export function WorkloadTerminatedLogViewer({
  workspaceId,
  workloadResourceName,
}: WorkloadTerminatedLogViewerProps) {
  const selectedTheme = useAtomValue(terminalThemeAtom);
  const currentTheme = selectedTheme || DEFAULT_THEME;

  const [logLines, setLogLines] = useState<string[]>([]);

  // 종료된 워크로드 로그 조회 (Blob 반환)
  const {
    data: logBlob,
    isLoading,
    isError,
  } = useGetTerminatedWorkloadLog(
    workspaceId,
    workloadResourceName,
    undefined,
    {
      query: {
        enabled: Boolean(workspaceId && workloadResourceName),
      },
    },
  );

  // Blob 데이터를 텍스트로 변환
  useEffect(() => {
    const parseBlob = async () => {
      if (!logBlob) {
        setLogLines([]);
        return;
      }

      try {
        const text = await logBlob.text();
        console.log(
          "[WorkloadTerminatedLogViewer] Blob parsed:",
          text.substring(0, 200),
        );
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        setLogLines(lines);
      } catch (error) {
        console.error(
          "[WorkloadTerminatedLogViewer] Failed to parse blob:",
          error,
        );
        setLogLines([]);
      }
    };

    parseBlob();
  }, [logBlob]);

  const renderLogContent = () => {
    if (isLoading) {
      return (
        <EmptyMessage className={currentTheme}>
          로그를 불러오는 중...
        </EmptyMessage>
      );
    }

    if (isError) {
      return <ErrorMessage>로그를 불러오는데 실패했습니다.</ErrorMessage>;
    }

    if (logLines.length === 0) {
      return (
        <EmptyMessage className={currentTheme}>로그가 없습니다.</EmptyMessage>
      );
    }

    return logLines.map((line, index) => (
      <LogLine key={index} data-testid={WORKLOAD_SELECTOR.LOG_LINE}>
        <LineNumber className={currentTheme}>{index + 1}</LineNumber>
        <LogMessage className={currentTheme}>{line || " "}</LogMessage>
      </LogLine>
    ));
  };

  return (
    <Container className={currentTheme}>
      <StatusBar>
        <StatusIndicator $color="#2196f3" />
        <StatusText>종료된 워크로드 로그</StatusText>
      </StatusBar>
      <LogViewer
        className={currentTheme}
        data-testid={WORKLOAD_SELECTOR.LOG_VIEWER}
      >
        {renderLogContent()}
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

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatusIndicator = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const StatusText = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const LogViewer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
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
  word-break: break-all;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const LineNumber = styled.span`
  min-width: 40px;
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
  user-select: none;

  /* 기본 테마 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground}50;

  /* 테마별 라인 번호 색상 */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground}50;
      }
    `,
  )}
`;

const LogMessage = styled.span`
  flex: 1;
  white-space: pre-wrap;

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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ff6b6b;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  /* 기본 테마 */
  color: ${TERMINAL_THEME_LIST[DEFAULT_THEME].foreground}80;

  /* 테마별 색상 */
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key} {
        color: ${value.foreground}80;
      }
    `,
  )}
`;
