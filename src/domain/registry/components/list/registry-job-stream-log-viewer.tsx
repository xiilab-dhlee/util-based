"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";

const DEFAULT_THEME = TERMINAL_THEME_LIST.MaterialDark;

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

interface RegistryJobStreamLogViewerProps {
  imageTagId: number;
}

/**
 * 실행 중인 이미지 등록 Job 로그 실시간 스트리밍 컴포넌트
 *
 * IN_PROGRESS 상태의 Job 로그를 SSE로 실시간 스트리밍합니다.
 */
export function RegistryJobStreamLogViewer({
  imageTagId,
}: RegistryJobStreamLogViewerProps) {
  const { data: session } = useSession();

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

  // SSE 연결 및 스트리밍
  useEffect(() => {
    const accessToken = session?.accessToken;
    if (!imageTagId || !accessToken) return;

    const controller = new AbortController();

    const connectSSE = async () => {
      const url = `/api/v1/registries/image-jobs/image-tags/${imageTagId}/logs/active`;

      try {
        setStatus("pending");
        setErrorMessage(null);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("ReadableStream not supported");
        }

        setStatus("streaming");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setStatus("completed");
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // SSE 형식 파싱: "event: log\ndata: ...\n\n"
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const logData = line.slice(5).trim();
              if (logData) {
                setLogs((prev) => [...prev, logData]);
              }
            }
          }
        }
      } catch (err) {
        // 컴포넌트 언마운트로 인한 정상 종료
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setStatus("error");
        setErrorMessage("로그 스트리밍 연결에 실패했습니다.");
      }
    };

    connectSSE();

    return () => {
      controller.abort();
    };
  }, [imageTagId, session?.accessToken]);

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
      return <EmptyMessage>{renderEmptyMessage()}</EmptyMessage>;
    }

    return logs.map((line, index) => (
      <LogLine key={index}>
        <LineNumber>{index + 1}</LineNumber>
        <LogMessage>{line || " "}</LogMessage>
      </LogLine>
    ));
  };

  return (
    <Container>
      <StatusBar>
        <StatusIndicator
          $color={statusInfo.color}
          $animate={statusInfo.animate}
        />
        <StatusText>{statusInfo.text}</StatusText>
      </StatusBar>
      <LogViewer ref={logViewerRef}>{renderLogContent()}</LogViewer>
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
  background: ${DEFAULT_THEME.background};
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
  color: ${DEFAULT_THEME.foreground};
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
  color: ${DEFAULT_THEME.foreground}50;
`;

const LogMessage = styled.span`
  flex: 1;
  white-space: pre-wrap;
  color: ${DEFAULT_THEME.foreground};
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
  color: ${DEFAULT_THEME.foreground}80;
`;
