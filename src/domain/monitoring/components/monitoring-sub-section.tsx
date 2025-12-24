import type { SorterResult } from "antd/es/table/interface";
import { useState } from "react";
import styled from "styled-components";

import { MonitoringWorkloadStatus } from "@/domain/monitoring/components/monitoring-workload-status";
import {
  ACTIVE_WORKLOAD_PAGE_SIZE,
  DEFAULT_ACTIVE_WORKLOAD_SORT,
  DEFAULT_USER_RESOURCE_SORT,
  DEFAULT_WORKSPACE_SORT,
} from "@/domain/monitoring/constants/monitoring.constant";
import { useGetUserResources } from "@/domain/monitoring/hooks/use-get-user-resources";
import type { UserResourceSchemaType } from "@/domain/monitoring/schemas/user-resource.schema";
import type {
  WorkloadListType,
  WorkloadStatusType,
} from "@/domain/workload/schemas/workload.schema";
import { useGetWorkspaces } from "@/domain/workspace/hooks/use-get-workspaces";
import type { WorkspaceListType } from "@/domain/workspace/schemas/workspace.schema";
import { workloadListMock } from "@/mocks/data/workload.mock";
import { createUserResourceColumn } from "@/shared/components/column/create-user-resource-column";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { createWorkspaceColumn } from "@/shared/components/column/create-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import type { TableSortState } from "@/shared/types/core.model";
import { getSortOrder, parseSorter } from "@/shared/utils/sort.util";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function MonitoringSubSection() {
  const [workspaceSort, setWorkspaceSort] = useState<TableSortState>(
    DEFAULT_WORKSPACE_SORT,
  );
  const [userResourceSort, setUserResourceSort] = useState<TableSortState>(
    DEFAULT_USER_RESOURCE_SORT,
  );
  const [activeWorkloadSort, setActiveWorkloadSort] = useState<TableSortState>(
    DEFAULT_ACTIVE_WORKLOAD_SORT,
  );
  const [activeWorkloadPage, setActiveWorkloadPage] = useState(1);

  const {
    data: workspacesData,
    isLoading: isWorkspacesLoading,
    isError: isWorkspacesError,
  } = useGetWorkspaces({
    page: 1,
    size: LIST_PAGE_SIZE,
    searchText: "",
    sortBy: workspaceSort.sortBy,
    sortDirection: workspaceSort.sortDirection,
  });

  const {
    data: userResourcesData,
    isLoading: isUserResourcesLoading,
    isError: isUserResourcesError,
  } = useGetUserResources({
    page: 1,
    size: LIST_PAGE_SIZE,
    sortBy: userResourceSort.sortBy,
    sortDirection: userResourceSort.sortDirection,
  });

  const workspaces = workspacesData?.content ?? [];
  const userResources = userResourcesData?.content ?? [];

  /** 워크스페이스 테이블 정렬 변경 핸들러 */
  const handleWorkspaceSortChange = (
    sorter: SorterResult<WorkspaceListType> | SorterResult<WorkspaceListType>[],
  ) => {
    const parsed = parseSorter(sorter);
    if (parsed) {
      setWorkspaceSort({
        sortBy: parsed.field,
        sortDirection: parsed.direction,
      });
      // TODO: 페이지네이션 추가 시 setPage(1) 호출 필요
    }
  };

  /** 사용자 리소스 테이블 정렬 변경 핸들러 */
  const handleUserResourceSortChange = (
    sorter:
      | SorterResult<UserResourceSchemaType>
      | SorterResult<UserResourceSchemaType>[],
  ) => {
    const parsed = parseSorter(sorter);
    if (parsed) {
      setUserResourceSort({
        sortBy: parsed.field,
        sortDirection: parsed.direction,
      });
      // TODO: 페이지네이션 추가 시 setPage(1) 호출 필요
    }
  };

  /** 활성화 워크로드 테이블 정렬 변경 핸들러 */
  const handleActiveWorkloadSortChange = (
    sorter: SorterResult<WorkloadListType> | SorterResult<WorkloadListType>[],
  ) => {
    const parsed = parseSorter(sorter);
    if (parsed) {
      setActiveWorkloadSort({
        sortBy: parsed.field,
        sortDirection: parsed.direction,
      });
      setActiveWorkloadPage(1);
    }
  };

  const workspaceColumns = createWorkspaceColumn([
    {
      dataIndex: "name",
      width: "20%",
      align: "left",
      sorter: true,
      sortOrder: getSortOrder(workspaceSort, "name"),
      ellipsis: true,
    },
    { dataIndex: "gpu", width: "9%", align: "center" },
    { dataIndex: "cpu", width: "9%", align: "center" },
    { dataIndex: "mem", width: "11%", align: "center" },
    { dataIndex: "running", width: "9%", align: "center" },
    { dataIndex: "pending", width: "9%", align: "center" },
    { dataIndex: "error", width: "9%", align: "center" },
    { dataIndex: "creatorName", width: "12%", align: "left" },
    {
      dataIndex: "creatorDate",
      width: "12%",
      align: "left",
      sorter: true,
      sortOrder: getSortOrder(workspaceSort, "creatorDate"),
    },
  ]);

  const userResourceColumns = createUserResourceColumn([
    {
      dataIndex: "userName",
      width: "20%",
      sorter: true,
      sortOrder: getSortOrder(userResourceSort, "userName"),
    },
    { dataIndex: "gpu", width: "16%" },
    { dataIndex: "mig", width: "16%" },
    { dataIndex: "mps", width: "16%" },
    { dataIndex: "cpu", width: "16%" },
    { dataIndex: "mem", width: "16%" },
  ]);

  const activeWorkloadColumns = createWorkloadColumn([
    {
      dataIndex: "workloadName",
      width: "30%",
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder(activeWorkloadSort, "workloadName"),
    },
    {
      dataIndex: "jobType",
      width: "20%",
      sorter: true,
      sortOrder: getSortOrder(activeWorkloadSort, "jobType"),
    },
    { dataIndex: "creatorName", width: "15%", ellipsis: true },
    { dataIndex: "elapsedTime", width: "20%" },
    { dataIndex: "status", width: "15%" },
  ]);

  return (
    <Container>
      <Left>
        <LeftArticle>
          <ArticleHeader>
            <ArticleTitle>
              <SectionTitle>전체 워크스페이스</SectionTitle>
              <ArticleDescription>총 24개</ArticleDescription>
            </ArticleTitle>
          </ArticleHeader>
          <LeftBody>
            <CustomizedTable<WorkspaceListType>
              columns={workspaceColumns}
              data={workspaces}
              activePadding
              onChange={(_pagination, _filters, sorter) => {
                handleWorkspaceSortChange(sorter);
              }}
              loading={isWorkspacesLoading}
              isError={isWorkspacesError}
            />
          </LeftBody>
        </LeftArticle>
        <LeftArticle>
          <ArticleHeader>
            <ArticleTitle>
              <SectionTitle>사용자별 리소스 점유율</SectionTitle>
              <ArticleDescription>
                총 {userResources.length}개
              </ArticleDescription>
            </ArticleTitle>
          </ArticleHeader>

          <LeftBody>
            <CustomizedTable<UserResourceSchemaType>
              columns={userResourceColumns}
              data={userResources}
              activePadding
              onChange={(_pagination, _filters, sorter) => {
                handleUserResourceSortChange(sorter);
              }}
              loading={isUserResourcesLoading}
              isError={isUserResourcesError}
            />
          </LeftBody>
        </LeftArticle>
      </Left>
      <Right>
        <ArticleTitle style={{ marginBottom: "0" }}>
          <SectionTitle>워크로드 정보</SectionTitle>
        </ArticleTitle>
        <WorkloadStatuses>
          {["ALL", "RUNNING", "PENDING", "FAILED"].map((status) => (
            <MonitoringWorkloadStatus
              key={status}
              status={status as WorkloadStatusType}
              total={9999}
            />
          ))}
        </WorkloadStatuses>

        <div>
          <ArticleTitle>
            <SectionTitle>활성화 워크로드 목록</SectionTitle>
            <ArticleDescription>총 24개</ArticleDescription>
          </ArticleTitle>
          <ListArticleBody>
            <CustomizedTable<WorkloadListType>
              columns={activeWorkloadColumns}
              data={workloadListMock}
              activePadding
              onChange={(_pagination, _filters, sorter) => {
                handleActiveWorkloadSortChange(sorter);
              }}
              pagination={{
                current: activeWorkloadPage,
                pageSize: ACTIVE_WORKLOAD_PAGE_SIZE,
                total: workloadListMock.length, // TODO: API 연동 시 실제 total로 교체
                onChange: setActiveWorkloadPage,
              }}
            />
          </ListArticleBody>
        </div>
      </Right>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 980px;

  --right-width: 620px;
`;

const Left = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc(100% - var(--right-width) - 16px);
`;

const LeftArticle = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 23px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background-color: #fafafa;
`;

const Right = styled.article`
  width: var(--right-width);
  flex-shrink: 0;
  height: 100%;
  padding: 23px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ArticleTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  position: relative;
  padding-left: 5px;
  margin-bottom: 20px;
`;

const ArticleDescription = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: #070913;
`;

const LeftBody = styled.div`
  flex: 1;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

const SectionTitle = styled(UserMonitoringSectionTitle)`
  color: #070913;
`;

const WorkloadStatuses = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
  height: 86px;

  --border-color: #ced2d6;
`;

const ListArticleBody = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
`;
