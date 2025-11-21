"use client";

import { useAtom } from "jotai";

import { useGetWorkloadVulnerabilities } from "@/domain/workload/hooks/use-get-workload-vulnerabilities";
import { workloadPageAtom } from "@/domain/workload/state/workload.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 워크로드 보안 취약점 페이지 하단 푸터 컴포넌트
 * @returns 워크로드 보안 취약점 페이지 하단 푸터 컴포넌트
 */
export function WorkloadSecurityFooter() {
  const [page, setPage] = useAtom(workloadPageAtom);

  const { data, isLoading } = useGetWorkloadVulnerabilities({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={(page) => setPage(page)}
      isLoading={isLoading}
    />
  );
}
