"use client";

import type { MouseEvent } from "react";
import styled from "styled-components";
import { Button, Card, Icon } from "xiilab-ui";

import type { QueueWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  formatDateTimeSafely,
  formatElapsedTime,
} from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes } from "@/shared/utils/resource.util";

interface UrgentQueueCardProps {
  workload: QueueWorkloadResponse;
  onDelete: (workload: QueueWorkloadResponse) => void;
}

/**
 * 긴급 대기열 카드 컴포넌트
 */
export function UrgentQueueCard({ workload, onDelete }: UrgentQueueCardProps) {
  const { resource } = workload;

  const memoryGB = convertBytes(resource.memory.quotaByte, "GB", 0).value;

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(workload);
  };

  return (
    <StyledCard
      contentVariant="compact"
      title={workload.workloadName}
      icon={
        <IconGroup>
          <Icon name="ColumnMove" size={16} color="#9DA6BC" />
          <RankBadge>{workload.rank ?? "-"}</RankBadge>
        </IconGroup>
      }
      actionElement={
        <DeleteButton onPointerDown={(e) => e.stopPropagation()}>
          <Button
            variant="text"
            size="small"
            icon="Close"
            onClick={handleDelete}
            aria-label="긴급 대기열 삭제"
          />
        </DeleteButton>
      }
    >
      <Body>
        <InfoColumn>
          <InfoRow>
            <InfoLabel>워크스페이스</InfoLabel>
            <InfoValue className="truncate">{workload.workspaceName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Job Type</InfoLabel>
            <InfoValue>{workload.jobType || "-"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>리소스 프리셋</InfoLabel>
            <InfoValue>{"미정"}</InfoValue>
          </InfoRow>
        </InfoColumn>

        <InfoColumn>
          <InfoRow>
            <InfoLabel>생성자</InfoLabel>
            <InfoValue>{workload.creatorName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>생성일시</InfoLabel>
            <InfoValue>{formatDateTimeSafely(workload.createdAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>대기 시간</InfoLabel>
            <InfoValue>{formatElapsedTime(workload.createdAt ?? "")}</InfoValue>
          </InfoRow>
        </InfoColumn>
      </Body>

      {/* 푸터: 리소스 정보 */}
      <Footer>
        <ResourceItem>
          <ResourceLabel>GPU</ResourceLabel>
          <ResourceValue>미정</ResourceValue>
        </ResourceItem>
        <ResourceItem>
          <ResourceLabel>CPU</ResourceLabel>
          <ResourceValue>
            {formatNumberWithUnit(resource.cpu.quotaCore, "Core")}
          </ResourceValue>
        </ResourceItem>
        <ResourceItem>
          <ResourceLabel>Memory</ResourceLabel>
          <ResourceValue>{formatNumberWithUnit(memoryGB, "GB")}</ResourceValue>
        </ResourceItem>
      </Footer>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  width: 100%;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DeleteButton = styled.div`
  display: flex;
`;

const RankBadge = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #534AD8;
  color: #fff;
  border-radius: 4px;
  font-weight: 600;
  font-size: 10px;
  flex-shrink: 0;
`;

const Body = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid var(--color-gray-10);
  width: 100%;
  padding-bottom: 10px;
`;

const InfoColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:first-child {
    border-right: 1px solid var(--color-gray-10);
    padding-right: 16px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoLabel = styled.span`
  width: 70px;
  font-weight: 500;
  font-size: 12px;
  color: #191B26;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  flex: 1;
  font-weight: 400;
  font-size: 12px;
  color: #191B26;
`;

const Footer = styled.div`
  display: flex;
  gap: 24px;
  padding-top: 12px;
  width: 100%;
`;

const ResourceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResourceLabel = styled.span`
  font-weight: 700;
  font-size: 12px;
  color: #191B26;
`;

const ResourceValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #191B26;
`;
