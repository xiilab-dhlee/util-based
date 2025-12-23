"use client";

import type { SorterResult } from "antd/es/table/interface";
import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { USER_WORKSPACE_MODAL_PAGE_SIZE } from "@/domain/monitoring/constants/monitoring.constant";
import type { UserResourceSchemaType } from "@/domain/monitoring/schemas/user-resource.schema";
import { openUserWorkspaceModalAtom } from "@/domain/monitoring/state/monitoring.atom";
import { createWorkspaceColumn } from "@/shared/components/column/create-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import type { TableSortState } from "@/shared/types/core.model";
import { getSortOrder, parseSorter } from "@/shared/utils/sort.util";

// TODO: API 연동 시 실제 타입으로 교체
interface UserWorkspaceType {
  id: string;
  name: string;
  gpuQuota: number;
  running: number;
  pending: number;
  error: number;
  [key: string]: unknown;
}

const DEFAULT_WORKSPACE_SORT: TableSortState = {
  sortBy: "name",
  sortDirection: "ASC",
};

const USER_WORKSPACE_MOCK: UserWorkspaceType[] = [
  {
    id: "1",
    name: "Test_suhyun",
    gpuQuota: 5,
    running: 1,
    pending: 1,
    error: 1,
  },
  {
    id: "2",
    name: "Test_suhyun",
    gpuQuota: 5,
    running: 3,
    pending: 3,
    error: 3,
  },
  {
    id: "3",
    name: "Test_suhyun",
    gpuQuota: 5,
    running: 3,
    pending: 3,
    error: 3,
  },
  {
    id: "4",
    name: "Test_suhyun",
    gpuQuota: 5,
    running: 3,
    pending: 3,
    error: 3,
  },
  {
    id: "5",
    name: "Test_suhyun",
    gpuQuota: 5,
    running: 56,
    pending: 56,
    error: 56,
  },
  {
    id: "6",
    name: "Test_suhyun",
    gpuQuota: 5,
    running: 4,
    pending: 4,
    error: 4,
  },
];

export function ViewUserWorkspaceModal() {
  const { open, onOpen, onClose } = useGlobalModal(openUserWorkspaceModalAtom);
  const [workspaceSort, setWorkspaceSort] = useState<TableSortState>(
    DEFAULT_WORKSPACE_SORT,
  );
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState<UserResourceSchemaType | null>(null);

  useSubscribe(MONITORING_EVENTS.sendUserWorkspace, (data: unknown) => {
    setUserData(data as UserResourceSchemaType);
    onOpen();
  });

  const workspaces = USER_WORKSPACE_MOCK;

  const handleSortChange = (
    sorter: SorterResult<UserWorkspaceType> | SorterResult<UserWorkspaceType>[],
  ) => {
    const parsed = parseSorter(sorter);
    if (parsed) {
      setWorkspaceSort({
        sortBy: parsed.field,
        sortDirection: parsed.direction,
      });
      setPage(1);
    }
  };

  const columns = createWorkspaceColumn([
    {
      dataIndex: "name",
      title: "워크스페이스 이름",
      width: "25%",
      sorter: true,
      sortOrder: getSortOrder(workspaceSort, "name"),
    },
    { dataIndex: "gpuQuota", title: "할당된 GPU 개수", width: "20%" },
    { dataIndex: "running", width: "18%" },
    { dataIndex: "pending", width: "18%" },
    { dataIndex: "error", width: "19%" },
  ]);

  const hasMigOrMps = !!(userData?.mig || userData?.mps);

  return (
    <InfoModal
      type="primary"
      modalWidth={750}
      icon={<Icon name="Description" color="#fff" size={18} />}
      open={open}
      closable
      onClose={onClose}
      title="워크 스페이스 정보"
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
                <ResourceLabel>GPU</ResourceLabel>
                <ResourceValue>{userData?.gpu ?? 0}개</ResourceValue>
              </ResourceRow>
              <ResourceRow>
                <ResourceLabel>CPU</ResourceLabel>
                <ResourceValue>{userData?.cpu ?? 0}Core</ResourceValue>
              </ResourceRow>
              <ResourceRow>
                <ResourceLabel>Memory</ResourceLabel>
                <ResourceValue>{userData?.mem ?? 0}GB</ResourceValue>
              </ResourceRow>
            </ResourceLeft>
            {hasMigOrMps && (
              <>
                <ResourceDivider />
                <ResourceRight>
                  {userData?.mig !== null && userData?.mig !== undefined && (
                    <ResourceRow>
                      <ResourceLabel>MIG</ResourceLabel>
                      <ResourceValue>{userData.mig}개</ResourceValue>
                    </ResourceRow>
                  )}
                  {userData?.mps !== null && userData?.mps !== undefined && (
                    <ResourceRow>
                      <ResourceLabel>MPS</ResourceLabel>
                      <ResourceValue>{userData.mps}개</ResourceValue>
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
          <CustomizedTable<UserWorkspaceType>
            columns={columns}
            data={workspaces}
            activePadding
            onChange={(_pagination, _filters, sorter) => {
              handleSortChange(sorter);
            }}
            pagination={{
              current: page,
              pageSize: USER_WORKSPACE_MODAL_PAGE_SIZE,
              total: workspaces.length,
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
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.14;
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
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.19;
  color: #484848;
  min-width: 50px;
`;

const InfoValue = styled.span`
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.14;
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
  width: 215px;
`;

const ResourceDivider = styled.div`
  width: 1px;
  height: 68px;
  background-color: #e9e9e9;
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ResourceLabel = styled.span`
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.19;
  color: #484848;
  min-width: 50px;
`;

const ResourceValue = styled.span`
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.14;
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
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.19;
  color: #000000;
`;
