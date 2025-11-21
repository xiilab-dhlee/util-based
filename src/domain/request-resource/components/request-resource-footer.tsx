"use client";

import { useAtom } from "jotai";

import { useGetWorkspaceRequestResources } from "@/domain/request-resource/hooks/use-get-request-resources";
import { requestResourcePageAtom } from "@/domain/request-resource/state/request-resource.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

export function RequestResourceFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(requestResourcePageAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetWorkspaceRequestResources({
    page,
    size: LIST_PAGE_SIZE,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
