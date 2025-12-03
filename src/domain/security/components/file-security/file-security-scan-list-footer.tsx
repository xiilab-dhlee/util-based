"use client";

import { useAtom } from "jotai";

import { useGetFileSecurityScanList } from "@/domain/security/hooks/use-get-file-security-scan-list";
import { fileSecurityScanListPageAtom } from "@/domain/security/state/file-security.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

export function FileSecurityScanListFooter() {
  const [page, setPage] = useAtom(fileSecurityScanListPageAtom);

  const { data, isLoading } = useGetFileSecurityScanList({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={isLoading}
    />
  );
}
