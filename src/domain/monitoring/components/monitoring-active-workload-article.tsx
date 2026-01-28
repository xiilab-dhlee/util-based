"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { MonitoringActiveWorkloadListBody } from "@/domain/monitoring/components/active-workload/monitoring-active-workload-list-body";
import { MonitoringActiveWorkloadListFilter } from "@/domain/monitoring/components/active-workload/monitoring-active-workload-list-filter";
import { MonitoringActiveWorkloadListFooter } from "@/domain/monitoring/components/active-workload/monitoring-active-workload-list-footer";
import { ACTIVE_WORKLOAD_PAGE_SIZE } from "@/domain/monitoring/constants/monitoring.constant";
import { monitoringActiveWorkloadPageAtom } from "@/domain/monitoring/state/monitoring.atom";

// TODO: 활성화 워크로드 API 연동 시 실제 API 훅으로 교체
// import { useGetActiveWorkloads } from "@/api/generated/...";

/**
 * 모니터링 페이지 - 활성화 워크로드 목록 섹션
 */
export function MonitoringActiveWorkloadArticle() {
  const [page, setPage] = useAtom(monitoringActiveWorkloadPageAtom);

  // TODO: 실제 API 연동 시 아래 주석 해제 및 수정
  // const { data, isLoading, isError } = useGetActiveWorkloads({
  //   pageNo: page - 1,
  //   pageSize: ACTIVE_WORKLOAD_PAGE_SIZE,
  // });

  // 임시 데이터 (API 연동 전)
  const workloads: never[] = [];
  const totalSize = 0;
  const isLoading = false;
  const isError = false;

  return (
    <Container>
      <MonitoringActiveWorkloadListFilter total={totalSize} />
      <MonitoringActiveWorkloadListBody
        workloads={workloads}
        isLoading={isLoading}
        isError={isError}
      />
      <MonitoringActiveWorkloadListFooter
        total={totalSize}
        page={page}
        pageSize={ACTIVE_WORKLOAD_PAGE_SIZE}
        isLoading={isLoading}
        onChangePage={setPage}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
