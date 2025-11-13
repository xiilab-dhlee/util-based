"use client";

import { useAtom } from "jotai";

import { workloadPageAtom } from "@/atoms/workload/workload-list.atom";
import { useGetWorkloadVulnerabilities } from "@/hooks/workload/use-get-workload-vulnerabilities";
import { ListPageFooter } from "@/layouts/list/list-page-footer";
import { Workload } from "@/models/workload.model";

export function WorkloadSecurityFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(workloadPageAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetWorkloadVulnerabilities({
    page,
    size: Workload.SECURITY_PAGE_SIZE,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.total || 0}
      page={page}
      pageSize={Workload.SECURITY_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
