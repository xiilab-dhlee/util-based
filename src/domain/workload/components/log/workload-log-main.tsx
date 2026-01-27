"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetWorkloadStatus } from "@/api/generated/workload/workload";
import { AsideWorkloadMonitoring } from "@/domain/workload/components/aside-workload-monitoring";
import { ViewWorkloadMonitoringModal } from "@/domain/workload/components/detail/view-workload-monitoring-modal";
import { WorkloadStreamLogViewer } from "@/domain/workload/components/log/workload-stream-log-viewer";
import { WorkloadTerminatedLogViewer } from "@/domain/workload/components/log/workload-terminated-log-viewer";
import { WorkloadMonitoringButton } from "@/domain/workload/components/workload-monitoring-button";
import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { TerminalThemeButton } from "@/shared/components/button/terminal-theme-button";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

export function WorkloadLogMain() {
  const { open } = useGlobalModal(openViewWorkloadMonitoringDrawerAtom);

  const params = useParams();
  const searchParams = useSearchParams();

  const workloadResourceName = params?.id as string;
  const workspaceId = Number(searchParams?.get("workspaceId"));

  // 워크로드 상태 단일 조회
  const { data: statusData, isLoading: isStatusLoading } = useGetWorkloadStatus(
    workspaceId,
    workloadResourceName,
    {
      query: {
        enabled: Boolean(workspaceId && workloadResourceName),
      },
    },
  );

  const workloadStatus = statusData?.workloadStatus;
  const isTerminated =
    workloadStatus === WorkloadStatusResponseWorkloadStatus.TERMINATED;

  // 디버깅 로그
  console.log("[WorkloadLogMain] params:", {
    workspaceId,
    workloadResourceName,
  });
  console.log("[WorkloadLogMain] status:", {
    statusData,
    workloadStatus,
    isStatusLoading,
    isTerminated,
  });

  // 로그 뷰어 렌더링 (상태에 따라 다른 컴포넌트 사용)
  const renderLogViewer = () => {
    if (isStatusLoading) {
      return <LoadingMessage>상태 확인 중...</LoadingMessage>;
    }

    if (!workloadStatus) {
      return (
        <LoadingMessage>워크로드 정보를 불러올 수 없습니다.</LoadingMessage>
      );
    }

    if (isTerminated) {
      // 종료된 워크로드: Blob 로그 API
      return (
        <WorkloadTerminatedLogViewer
          workspaceId={workspaceId}
          workloadResourceName={workloadResourceName}
        />
      );
    }

    // 실행 중인 워크로드: SSE 스트리밍
    return (
      <WorkloadStreamLogViewer
        workspaceId={workspaceId}
        workloadResourceName={workloadResourceName}
      />
    );
  };

  return (
    <>
      <DetailContentHeader>
        <DetailContentTitle>로그</DetailContentTitle>
        <DetailContentTitleTool>
          <WorkloadMonitoringButton />
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton />
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      <LogContent>
        {renderLogViewer()}
        {open && <AsideWorkloadMonitoring />}
      </LogContent>
      {/* 워크로드 모니터링 모달 */}
      <ViewWorkloadMonitoringModal />
    </>
  );
}

const LoadingMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  background: #263238;
  border-radius: 4px;
`;

const LogContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
`;
