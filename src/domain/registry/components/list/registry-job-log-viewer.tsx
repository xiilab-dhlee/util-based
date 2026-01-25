"use client";

import styled from "styled-components";

import { useGetTerminatedImageJobLog } from "@/api/generated/image-job/image-job";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";

const DEFAULT_THEME = TERMINAL_THEME_LIST.MaterialDark;

interface RegistryJobLogViewerProps {
  imageTagId: number;
}

/**
 * 종료된 이미지 등록 Job 로그 뷰어 컴포넌트
 *
 * COMPLETED, FAILED 상태의 Job 로그를 표시합니다.
 */
export function RegistryJobLogViewer({
  imageTagId,
}: RegistryJobLogViewerProps) {
  const {
    data: logData,
    isLoading,
    isError,
  } = useGetTerminatedImageJobLog(imageTagId, {
    query: {
      enabled: !!imageTagId,
    },
  });

  const logLines = logData && logData.trim() !== "" ? logData.split("\n") : [];

  const renderLogContent = () => {
    if (isLoading) {
      return <LoadingMessage>로그를 불러오는 중...</LoadingMessage>;
    }

    if (isError) {
      return <ErrorMessage>로그를 불러오는데 실패했습니다.</ErrorMessage>;
    }

    if (logLines.length === 0) {
      return <EmptyMessage>로그가 없습니다.</EmptyMessage>;
    }

    return logLines.map((line, index) => (
      <LogLine key={index}>
        <LineNumber>{index + 1}</LineNumber>
        <LogMessage>{line || " "}</LogMessage>
      </LogLine>
    ));
  };

  return (
    <Container>
      <LogViewer>{renderLogContent()}</LogViewer>
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

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${DEFAULT_THEME.foreground}80;
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
