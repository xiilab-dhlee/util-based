"use client";

import { useAtom } from "jotai";
import { useParams } from "next/navigation";

import { useGetFileSecurityScanFiles } from "@/domain/security/hooks/use-get-file-security-scan-files";
import { fileSecurityScanFilePageAtom } from "@/domain/security/state/file-security.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 파일 시스템 보안 검사 파일 목록 푸터 컴포넌트
 *
 * 검사 상세 페이지에서 검사된 파일 목록의 페이지네이션을 제공합니다.
 */
export function FileSecurityScanFileListFooter() {
  const { id } = useParams();
  const [page, setPage] = useAtom(fileSecurityScanFilePageAtom);

  const { data, isLoading } = useGetFileSecurityScanFiles({
    page,
    size: LIST_PAGE_SIZE,
    scanId: Number(id),
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
