"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { useGetAllAccountResources } from "@/api/generated/admin-account-management/admin-account-management";
import { MonitoringUserResourceListBody } from "@/domain/monitoring/components/user-resource/monitoring-user-resource-list-body";
import { MonitoringUserResourceListFilter } from "@/domain/monitoring/components/user-resource/monitoring-user-resource-list-filter";
import { MonitoringUserResourceListFooter } from "@/domain/monitoring/components/user-resource/monitoring-user-resource-list-footer";
import { MONITORING_USER_RESOURCE_PAGE_SIZE } from "@/domain/monitoring/constants/monitoring.constant";
import { monitoringUserResourcePageAtom } from "@/domain/monitoring/state/monitoring.atom";

/**
 * 모니터링 페이지 - 사용자별 리소스 점유율 섹션
 */
export function MonitoringUserResourceArticle() {
  const [page, setPage] = useAtom(monitoringUserResourcePageAtom);

  const { data, isLoading, isError } = useGetAllAccountResources({
    pageNo: page - 1,
    pageSize: MONITORING_USER_RESOURCE_PAGE_SIZE,
  });

  const userResources = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  return (
    <Container>
      <MonitoringUserResourceListFilter total={totalSize} />
      <MonitoringUserResourceListBody
        userResources={userResources}
        isLoading={isLoading}
        isError={isError}
      />
      <MonitoringUserResourceListFooter
        total={totalSize}
        page={page}
        pageSize={MONITORING_USER_RESOURCE_PAGE_SIZE}
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
