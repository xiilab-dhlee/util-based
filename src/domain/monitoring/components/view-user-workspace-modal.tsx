"use client";

import { isNil } from "es-toolkit";
import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal, Tag } from "xiilab-ui";

import { USER_WORKSPACE_MODAL_PAGE_SIZE } from "@/domain/monitoring/constants/monitoring.constant";
import type { UserResourceSchemaType } from "@/domain/monitoring/schemas/user-resource.schema";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { useStateModal } from "@/shared/hooks/use-state-modal";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { formatNumber } from "@/shared/utils/format.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import { getTableRowNumber } from "@/shared/utils/table.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

// TODO: API 연동 시 실제 타입으로 교체
type GpuType = "normal" | "mig" | "mps";

interface UserWorkloadType {
  id: string;
  workspaceId: number;
  workloadName: string;
  workspaceName: string;
  nodeName: string;
  gpuType: GpuType;
  gpuModel?: string;
  gpuCount?: number;
  [key: string]: unknown;
}

const USER_WORKLOAD_MOCK: UserWorkloadType[] = [
  {
    id: "1",
    workspaceId: 1,
    workloadName: "workload-1",
    workspaceName: "workspace-1",
    nodeName: "node-1",
    gpuType: "normal",
    gpuModel: undefined,
    gpuCount: undefined,
  },
  {
    id: "2",
    workspaceId: 2,
    workloadName: "workload-2",
    workspaceName: "workspace-2",
    nodeName: "node-2",
    gpuType: "mig",
    gpuModel: undefined,
    gpuCount: undefined,
  },
  {
    id: "3",
    workspaceId: 3,
    workloadName: "workload-3",
    workspaceName: "workspace-3",
    nodeName: "node-3",
    gpuType: "mps",
    gpuModel: undefined,
    gpuCount: undefined,
  },
  {
    id: "4",
    workspaceId: 4,
    workloadName: "workload-4",
    workspaceName: "workspace-4",
    nodeName: "node-4",
    gpuType: "normal",
    gpuModel: undefined,
    gpuCount: undefined,
  },
  {
    id: "5",
    workspaceId: 5,
    workloadName: "workload-5",
    workspaceName: "workspace-5",
    nodeName: "node-5",
    gpuType: "mig",
    gpuModel: undefined,
    gpuCount: undefined,
  },
  {
    id: "6",
    workspaceId: 6,
    workloadName: "workload-6",
    workspaceName: "workspace-6",
    nodeName: "node-6",
    gpuType: "mps",
    gpuModel: undefined,
    gpuCount: undefined,
  },
];

/** 값이 있으면 단위를 붙여 반환, 없으면 "-" 반환 */
const withUnit = (value: number | null | undefined, type: CoreResourceType) =>
  value != null ? `${formatNumber(value)}${getResourceInfo(type).unit}` : "-";

/**
 * GPU 컬럼 렌더링 함수
 * - Normal: gpuModel이 있으면 표시, 없으면 "-"
 * - MIG/MPS: 태그 + 구분선 + gpuModel(또는 "-")
 */
const renderGpuColumn = (record: UserWorkloadType) => {
  const { gpuType, gpuModel } = record;
  const displayValue = gpuModel || "-";

  if (gpuType === "normal") {
    return <span>{displayValue}</span>;
  }

  const tagLabel = gpuType.toUpperCase();

  return (
    <GpuColumnWrapper>
      <Tag variant="gray">{tagLabel}</Tag>
      <GpuDivider />
      <span>{displayValue}</span>
    </GpuColumnWrapper>
  );
};

export function ViewUserWorkspaceModal() {
  const { open, onOpen, onClose } = useStateModal();
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState<UserResourceSchemaType | null>(null);

  useSubscribe(MONITORING_EVENTS.sendUserWorkspace, (data: unknown) => {
    setUserData(data as UserResourceSchemaType);
    onOpen();
  });

  const workloads = USER_WORKLOAD_MOCK;

  const columns = [
    {
      dataIndex: "no",
      title: "No.",
      align: "center" as const,
      width: "8%",
      render: (_: unknown, __: unknown, index: number) => {
        const rowNumber = getTableRowNumber(
          page,
          USER_WORKSPACE_MODAL_PAGE_SIZE,
          index,
        );
        return <span>{rowNumber}</span>;
      },
    },
    {
      dataIndex: "workloadName",
      title: "워크로드 이름",
      align: "left" as const,
      width: "22%",
      ellipsis: true,
      render: (_: unknown, record: UserWorkloadType) => (
        <ColumnLink
          href={ROUTES.ADMIN_WORKSPACE_WORKLOAD_DETAIL(
            record.workspaceId,
            record.id,
          )}
        >
          {record.workloadName}
        </ColumnLink>
      ),
    },
    {
      dataIndex: "workspaceName",
      title: "워크스페이스 이름",
      align: "left" as const,
      width: "22%",
      ellipsis: true,
    },
    {
      dataIndex: "nodeName",
      title: "노드 이름",
      align: "left" as const,
      width: "20%",
      ellipsis: true,
    },
    {
      dataIndex: "gpu",
      title: "GPU",
      align: "center" as const,
      width: "28%",
      render: (_: unknown, record: UserWorkloadType) => renderGpuColumn(record),
    },
  ];

  const hasMigOrMps = !!(userData?.mig || userData?.mps);

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
        {/* 사용 정보 & 리소스 점유율 정보 통합 박스 */}
        <InfoResourceBox>
          {/* 사용 정보 */}
          <SectionTitle>사용 정보</SectionTitle>
          <InfoSection>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{userData?.userName || "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>{userData?.email || "-"}</InfoValue>
            </InfoRow>
          </InfoSection>

          <SectionDivider />

          {/* 리소스 점유율 정보 */}
          <SectionTitle>리소스 점유율 정보</SectionTitle>
          <ResourceSection>
            <ResourceLeft>
              <ResourceRow>
                <ResourceLabel>{getResourceInfo("GPU").text}</ResourceLabel>
                <ResourceValue>{withUnit(userData?.gpu, "GPU")}</ResourceValue>
              </ResourceRow>
              <ResourceRow>
                <ResourceLabel>{getResourceInfo("CPU").text}</ResourceLabel>
                <ResourceValue>{withUnit(userData?.cpu, "CPU")}</ResourceValue>
              </ResourceRow>
              <ResourceRow>
                <ResourceLabel>{getResourceInfo("MEM").text}</ResourceLabel>
                <ResourceValue>{withUnit(userData?.mem, "MEM")}</ResourceValue>
              </ResourceRow>
            </ResourceLeft>
            {hasMigOrMps && (
              <>
                <ResourceDivider />
                <ResourceRight>
                  {!isNil(userData?.mig) && (
                    <ResourceRow>
                      <ResourceLabel>
                        {getResourceInfo("MIG").text}
                      </ResourceLabel>
                      <ResourceValue>
                        {withUnit(userData.mig, "MIG")}
                      </ResourceValue>
                    </ResourceRow>
                  )}
                  {!isNil(userData?.mps) && (
                    <ResourceRow>
                      <ResourceLabel>
                        {getResourceInfo("MPS").text}
                      </ResourceLabel>
                      <ResourceValue>
                        {withUnit(userData.mps, "MPS")}
                      </ResourceValue>
                    </ResourceRow>
                  )}
                </ResourceRight>
              </>
            )}
          </ResourceSection>
        </InfoResourceBox>

        {/* 워크로드 목록 */}
        <WorkloadSection>
          <WorkloadTitle>워크로드 목록</WorkloadTitle>
          <CustomizedTable<UserWorkloadType>
            columns={columns}
            data={workloads}
            activePadding
            pagination={{
              current: page,
              pageSize: USER_WORKSPACE_MODAL_PAGE_SIZE,
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
  min-width: 50px;
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
  gap: 35px;
`;

const ResourceLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 215px;
`;

const ResourceRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 215px;
`;

const ResourceDivider = styled.div`
  width: 1px;
  background-color: #e9e9e9;
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ResourceLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 1.19;
  color: #484848;
  min-width: 50px;
`;

const ResourceValue = styled.span`
  font-weight: 400;
  font-size: 14px;

  color: #000000;
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

const GpuColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const GpuDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #acacac;
`;
