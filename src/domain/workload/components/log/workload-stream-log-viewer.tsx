"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { terminalThemeAtom } from "@/shared/state/terminal.atom";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";
import { createTermBgClasses } from "@/styles/mixins/terminal";

const DEFAULT_THEME = "MaterialDark";

/** 스트리밍 연결 상태 */
type StreamingStatus = "pending" | "streaming" | "completed" | "error";

/** 상태별 표시 정보 */
interface StatusInfo {
  color: string;
  text: string;
  animate: boolean;
}

const STATUS_INFO_MAP: Record<StreamingStatus, StatusInfo> = {
  pending: { color: "#ff9800", text: "연결 대기 중...", animate: false },
  streaming: {
    color: "#4caf50",
    text: "실시간 로그 스트리밍 중...",
    animate: true,
  },
  completed: { color: "#2196f3", text: "스트리밍 종료", animate: false },
  error: { color: "#ff6b6b", text: "연결 오류", animate: false },
};

interface WorkloadStreamLogViewerProps {
  workspaceId: number;
  workloadResourceName: string;
}

/**
 * 실행 중인 워크로드 로그 실시간 스트리밍 컴포넌트
 *
 * TERMINATED가 아닌 상태의 워크로드 로그를 SSE로 실시간 스트리밍합니다.
 */
export function WorkloadStreamLogViewer({
  workspaceId,
  workloadResourceName,
}: WorkloadStreamLogViewerProps) {
  const { data: session } = useSession();
  const selectedTheme = useAtomValue(terminalThemeAtom);
  const currentTheme = selectedTheme || DEFAULT_THEME;

  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<StreamingStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const logViewerRef = useRef<HTMLDivElement>(null);

  // 로그 추가 시 자동 스크롤
  useEffect(() => {
    if (logs.length > 0 && logViewerRef.current) {
      logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
    }
  }, [logs.length]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // SSE 연결 및 스트리밍
  useEffect(() => {
    const accessToken = session?.accessToken;
    if (!workspaceId || !workloadResourceName || !accessToken) {
      return;
    }

    abortControllerRef.current = new AbortController();

    const url = `/api/v1/workspaces/${workspaceId}/workloads/${workloadResourceName}/logs/active`;

    console.log("[WorkloadStreamLogViewer] SSE connecting:", url);

    setStatus("pending");
    setErrorMessage(null);
    setLogs([]);

    fetchEventSource(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: abortControllerRef.current.signal,

      async onopen(response) {
        console.log("[WorkloadStreamLogViewer] SSE opened:", response.status);
        if (response.ok) {
          setStatus("streaming");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      },

      onmessage(event) {
        console.log("[WorkloadStreamLogViewer] SSE message:", event.data);
        const logData = event.data?.trim();
        if (logData) {
          setLogs((prev) => [...prev, logData]);
        }
      },

      onerror(err) {
        console.error("[WorkloadStreamLogViewer] SSE error:", err);
        // 컴포넌트 언마운트로 인한 정상 종료
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setStatus("error");
        setErrorMessage("로그 스트리밍 연결에 실패했습니다.");
        throw err; // 재연결 방지
      },

      onclose() {
        console.log("[WorkloadStreamLogViewer] SSE closed");
        setStatus("completed");
      },
    });

    return () => {
      disconnect();
    };
  }, [workspaceId, workloadResourceName, session?.accessToken, disconnect]);

  const statusInfo = STATUS_INFO_MAP[status];

  const renderEmptyMessage = () => {
    if (status === "completed") {
      return "로그가 없습니다.";
    }
    return "로그를 기다리는 중...";
  };

  const renderLogContent = () => {
    if (status === "error") {
      return <ErrorMessage>{errorMessage}</ErrorMessage>;
    }

    if (logs.length === 0) {
      return (
        <EmptyMessage className={currentTheme}>
          {renderEmptyMessage()}
        </EmptyMessage>
      );
    }

    return logs.map((line, index) => (
      <LogLine key={index} data-testid={WORKLOAD_SELECTOR.LOG_LINE}>
        <LineNumber className={currentTheme}>{index + 1}</LineNumber>
        <LogMessage className={currentTheme}>{line || " "}</LogMessage>
      </LogLine>
    ));
  };

  return (
    <Container className={currentTheme}>
      <StatusBar>
        <StatusIndicator
          $color={statusInfo.color}
          $animate={statusInfo.animate}
        />
        <StatusText>{statusInfo.text}</StatusText>
      </StatusBar>
      <LogViewer
        ref={logViewerRef}
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

const StatusIndicator = styled.div<{ $color: string; $animate: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${({ $animate }) => ($animate ? "pulse 2s infinite" : "none")};

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
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
