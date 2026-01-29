"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { useGetWorkspaceSummaryList } from "@/api/generated/admin-workspace/admin-workspace";
import { MonitoringWorkspaceListBody } from "@/domain/monitoring/components/workspace/monitoring-workspace-list-body";
import { MonitoringWorkspaceListFilter } from "@/domain/monitoring/components/workspace/monitoring-workspace-list-filter";
import { MonitoringWorkspaceListFooter } from "@/domain/monitoring/components/workspace/monitoring-workspace-list-footer";
import { MONITORING_WORKSPACE_PAGE_SIZE } from "@/domain/monitoring/constants/monitoring.constant";
import {
  monitoringWorkspacePageAtom,
  monitoringWorkspaceSortAtom,
} from "@/domain/monitoring/state/monitoring.atom";

/**
 * 모니터링 페이지 - 전체 워크스페이스 섹션
 */
export function MonitoringWorkspaceArticle() {
  const [page, setPage] = useAtom(monitoringWorkspacePageAtom);
  const [sortState, setSortState] = useAtom(monitoringWorkspaceSortAtom);

  const { data, isLoading, isError } = useGetWorkspaceSummaryList({
    pageNo: page - 1,
    pageSize: MONITORING_WORKSPACE_PAGE_SIZE,
    sort: sortState.sort,
    order: sortState.order,
  });

  const workspaces = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  return (
    <Container>
      <MonitoringWorkspaceListFilter total={totalSize} />
      <MonitoringWorkspaceListBody
        workspaces={workspaces}
        isLoading={isLoading}
        isError={isError}
        sortState={sortState}
        onSortChange={(newSort) => {
          setSortState(newSort);
          setPage(1);
        }}
      />
      <MonitoringWorkspaceListFooter
        total={totalSize}
        page={page}
        pageSize={MONITORING_WORKSPACE_PAGE_SIZE}
        isLoading={isLoading}
        onChangePage={setPage}
      />
    </Container>
  );
}

const Container = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 23px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background-color: #fafafa;
`;
