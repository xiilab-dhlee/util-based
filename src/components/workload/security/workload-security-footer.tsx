"use client";

import { useAtom } from "jotai";

import { workloadPageAtom } from "@/atoms/workload.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetWorkloadVulnerabilities } from "@/hooks/workload/use-get-workload-vulnerabilities";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

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
