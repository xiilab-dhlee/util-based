"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import type { AdminWorkspaceSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MONITORING_WORKSPACE_MODAL_PAGE_SIZE } from "@/domain/monitoring/constants/monitoring.constant";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { useStateModal } from "@/shared/hooks/use-state-modal";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { getTableRowNumber } from "@/shared/utils/table.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

// TODO: API 연동 시 실제 타입으로 교체
interface WorkspaceWorkloadType {
  workloadId: number;
  workloadName: string;
  status: string;
  jobType: string;
  createdAt: string;
}

const WORKSPACE_WORKLOAD_MOCK: WorkspaceWorkloadType[] = [];

/**
 * 워크스페이스 요약 정보 모달
 */
export function ViewWorkspaceSummaryModal() {
  const { open, onOpen, onClose } = useStateModal();
  const [page, setPage] = useState(1);
  const [workspaceData, setWorkspaceData] =
    useState<AdminWorkspaceSummaryResponse | null>(null);

  useSubscribe(MONITORING_EVENTS.sendWorkspaceSummary, (data: unknown) => {
    setWorkspaceData(data as AdminWorkspaceSummaryResponse);
    setPage(1);
    onOpen();
  });

  const workloads = WORKSPACE_WORKLOAD_MOCK;

  const columns = [
    {
      dataIndex: "no",
      title: "No.",
      align: "center" as const,
      width: "10%",
      render: (_: unknown, __: unknown, index: number) => {
        const rowNumber = getTableRowNumber(
          page,
          MONITORING_WORKSPACE_MODAL_PAGE_SIZE,
          index,
        );
        return <span>{rowNumber}</span>;
      },
    },
    {
      dataIndex: "workloadName",
      title: "워크로드 이름",
      align: "left" as const,
      width: "30%",
      ellipsis: true,
      render: (_: unknown, record: WorkspaceWorkloadType) => (
        <ColumnLink
          href={ROUTES.ADMIN_WORKSPACE_WORKLOAD_DETAIL(
            workspaceData?.workspaceId ?? 0,
            String(record.workloadId),
          )}
        >
          {record.workloadName}
        </ColumnLink>
      ),
    },
    {
      dataIndex: "status",
      title: "상태",
      align: "center" as const,
      width: "15%",
    },
    {
      dataIndex: "jobType",
      title: "작업 유형",
      align: "center" as const,
      width: "20%",
    },
    {
      dataIndex: "createdAt",
      title: "생성일",
      align: "center" as const,
      width: "25%",
      render: (createdAt: string) => formatDateSafely(createdAt),
    },
  ];

  return (
    <InfoModal
      type="primary"
      modalWidth={750}
      icon={<Icon name="Description" color="#fff" size={18} />}
      open={open}
      closable
      onClose={onClose}
      title="워크스페이스 정보"
      centered
    >
      <ModalContent>
        {/* 워크스페이스 기본 정보 */}
        <InfoResourceBox>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoSection>
            <InfoRow>
              <InfoLabel>워크스페이스 이름</InfoLabel>
              <InfoValue>{workspaceData?.workspaceName || "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>생성자</InfoLabel>
              <InfoValue>{workspaceData?.creatorName || "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>생성일</InfoLabel>
              <InfoValue>
                {formatDateSafely(workspaceData?.createdAt)}
              </InfoValue>
            </InfoRow>
          </InfoSection>

          <SectionDivider />

          {/* 리소스 사용률 정보 */}
          <SectionTitle>리소스 사용률</SectionTitle>
          <ResourceSection>
            <ResourceRow>
              <ResourceLabel>GPU</ResourceLabel>
              <ResourceValue>
                {formatNumberWithUnit(
                  workspaceData?.resource?.utilization?.gpu?.currentPercent,
                  "%",
                )}
              </ResourceValue>
            </ResourceRow>
            <ResourceRow>
              <ResourceLabel>CPU</ResourceLabel>
              <ResourceValue>
                {formatNumberWithUnit(
                  workspaceData?.resource?.utilization?.cpu?.currentPercent,
                  "%",
                )}
              </ResourceValue>
            </ResourceRow>
            <ResourceRow>
              <ResourceLabel>Memory</ResourceLabel>
              <ResourceValue>
                {formatNumberWithUnit(
                  workspaceData?.resource?.utilization?.memory?.currentPercent,
                  "%",
                )}
              </ResourceValue>
            </ResourceRow>
          </ResourceSection>

          <SectionDivider />

          {/* 워크로드 현황 정보 */}
          <SectionTitle>워크로드 현황</SectionTitle>
          <WorkloadStatusSection>
            <WorkloadStatusItem>
              <WorkloadStatusLabel>실행중</WorkloadStatusLabel>
              <WorkloadStatusValue $variant="running">
                {workspaceData?.runningWorkloadCount ?? 0}
              </WorkloadStatusValue>
            </WorkloadStatusItem>
            <WorkloadStatusItem>
              <WorkloadStatusLabel>대기중</WorkloadStatusLabel>
              <WorkloadStatusValue $variant="pending">
                {workspaceData?.pendingWorkloadCount ?? 0}
              </WorkloadStatusValue>
            </WorkloadStatusItem>
            <WorkloadStatusItem>
              <WorkloadStatusLabel>에러</WorkloadStatusLabel>
              <WorkloadStatusValue $variant="error">
                {workspaceData?.errorWorkloadCount ?? 0}
              </WorkloadStatusValue>
            </WorkloadStatusItem>
          </WorkloadStatusSection>
        </InfoResourceBox>

        {/* 워크로드 목록 */}
        <WorkloadSection>
          <WorkloadTitle>워크로드 목록</WorkloadTitle>
          <CustomizedTable<WorkspaceWorkloadType>
            columns={columns}
            data={workloads}
            activePadding
            pagination={{
              current: page,
              pageSize: MONITORING_WORKSPACE_MODAL_PAGE_SIZE,
              total: workloads.length,
              onChange: setPage,
            }}
          />
        </WorkloadSection>
      </ModalContent>
    </InfoModal>
  );
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const InfoResourceBox = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 4px 4px 2px 2px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #484848;
  min-width: 100px;
`;

const InfoValue = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #000000;
`;

const SectionDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e1e4e7;
`;

const ResourceSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ResourceLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #484848;
  min-width: 50px;
`;

const ResourceValue = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #000000;
`;

const WorkloadStatusSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
`;

const WorkloadStatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WorkloadStatusLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #484848;
`;

const WorkloadStatusValue = styled.span<{
  $variant: "running" | "pending" | "error";
}>`
  font-weight: 600;
  font-size: 14px;
  color: ${({ $variant }) => {
    switch ($variant) {
      case "running":
        return "#52c41a";
      case "pending":
        return "#faad14";
      case "error":
        return "#ff4d4f";
      default:
        return "#000000";
    }
  }};
`;

const WorkloadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const WorkloadTitle = styled.h3`
  margin: 0;
  font-weight: 600;
  font-size: 12px;
  color: #000000;
`;
