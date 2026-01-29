"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { WorkloadDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useWorkloadStatusPolling } from "@/domain/workload/hooks/use-workload-status-polling";
import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { WorkloadStatusText } from "@/shared/components/text/workload-status-text";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  DetailIntroCardBody,
  DetailIntroCardContainer,
  DetailIntroCardDescription,
  DetailIntroCardDescriptionRow,
  DetailIntroCardDescriptionRowBody,
  DetailIntroCardHeader,
  DetailIntroCardRow,
  DetailIntroCardRowBody,
  DetailIntroCardRowIconWrapper,
  DetailIntroCardRowTitle,
  DetailIntroCardTitle,
} from "@/styles/layers/detail-page-intro-card.styled";

interface WorkloadInfoPanelProps {
  data?: WorkloadDetailResponse;
}

/**
 * 워크로드 상세 페이지의 정보 패널 컴포넌트
 *
 * 워크로드의 기본 정보(이름, 상태, 설명)를 표시하고
 * 수정, 정지/재시작, 삭제 등의 액션을 제공합니다.
 */
export function WorkloadInfoPanel({ data }: WorkloadInfoPanelProps) {
  const publish = usePublish();
  const params = useParams();
  const searchParams = useSearchParams();

  const workloadId = params?.id as string;
  const workspaceId = Number(searchParams?.get("workspaceId") || "");

  // 워크로드 상태 실시간 폴링 (10초마다 상태만 조회)
  const { status } = useWorkloadStatusPolling({
    workspaceId,
    workloadResourceName: workloadId,
    enabled: Boolean(workspaceId && workloadId),
  });

  const isTerminated = status === "TERMINATED";

  const handleModify = () => {
    publish(WORKLOAD_EVENTS.openUpdateModal, {
      workloadResourceName: workloadId,
      workspaceId,
      workloadName: data?.workloadName,
      description: data?.description,
    });
  };

  const handleStop = () => {
    publish(WORKLOAD_EVENTS.openStopModal, {
      workloadResourceName: workloadId,
      workspaceId,
    });
  };

  const handleRestart = () => {
    publish(WORKLOAD_EVENTS.openRestartModal, {
      workloadResourceName: workloadId,
      workspaceId,
      resourcePresetId: data?.resourcePreset?.resourcePresetId,
    });
  };

  const handleDelete = () => {
    publish(WORKLOAD_EVENTS.openDeleteModal, {
      workloadResourceName: workloadId,
      workspaceId,
    });
  };

  return (
    <DetailIntroCardContainer>
      {/* 헤더 영역: 워크로드 이름과 액션 버튼 */}
      <DetailIntroCardHeader>
        <DetailIntroCardTitle>
          <span
            className="truncate"
            data-testid={WORKLOAD_SELECTOR.DETAIL_NAME}
          >
            {data?.workloadName ?? "-"}
          </span>
        </DetailIntroCardTitle>
        <ToolBox>
          <IconButton
            onClick={handleModify}
            data-testid={WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON}
          >
            <Icon name="Edit02" color="var(--icon-fill)" size={24} />
            <span className="sr-only">워크로드 설명, 라벨 수정</span>
          </IconButton>
          {isTerminated ? (
            <IconButton
              onClick={handleRestart}
              data-testid={WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON}
            >
              <RefreshIcon width={20} height={20} fill="var(--icon-fill)" />
              <span className="sr-only">워크로드 재시작</span>
            </IconButton>
          ) : (
            <IconButton
              onClick={handleStop}
              data-testid={WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON}
            >
              <Icon name="Power" color="var(--icon-fill)" size={24} />
              <span className="sr-only">워크로드 종료</span>
            </IconButton>
          )}
          {isTerminated && (
            <IconButton
              onClick={handleDelete}
              data-testid={WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON}
            >
              <Icon name="Delete" color="var(--icon-fill)" size={24} />
              <span className="sr-only">워크로드 삭제</span>
            </IconButton>
          )}
        </ToolBox>
      </DetailIntroCardHeader>

      {/* 본문 영역: 워크로드 상세 정보 */}
      <DetailIntroCardBody>
        {/* 워크로드 상태 정보 */}
        <DetailIntroCardRow>
          <DetailIntroCardRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Info" color="var(--icon-fill)" size={24} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>
              <StatusTitle>워크로드 상태</StatusTitle>
              <StatusWrapper className={status || ""}>
                {status && <WorkloadStatusText status={status} />}
              </StatusWrapper>
            </DetailIntroCardRowTitle>
          </DetailIntroCardRowBody>
        </DetailIntroCardRow>

        {/* 워크로드 설명 정보 */}
        <DetailIntroCardDescriptionRow>
          <DetailIntroCardDescriptionRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={22} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>워크로드 설명</DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          <DetailIntroCardDescription
            data-testid={WORKLOAD_SELECTOR.DETAIL_DESCRIPTION}
          >
            {data?.description || "-"}
          </DetailIntroCardDescription>
        </DetailIntroCardDescriptionRow>
      </DetailIntroCardBody>
    </DetailIntroCardContainer>
  );
}

const ToolBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  background-color: transparent;
  --icon-fill: #ced5db;
`;

const StatusTitle = styled.span`
  margin-right: 10px;
`;

const StatusWrapper = styled.div`
  &.TERMINATED p {
    color: #868994 !important;
  }
`;
