"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { useGetFileSecurityScanFiles } from "@/domain/security/hooks/use-get-file-security-scan-files";
import { fileSecurityScanFilePageAtom } from "@/domain/security/state/file-security.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 파일 시스템 보안 검사 파일 목록 필터 컴포넌트
 *
 * 검사 상세 페이지에서 검사된 파일 목록의 타이틀과 총 개수를 표시합니다.
 */
export function FileSecurityScanFileListFilter() {
  const { id } = useParams();

  const page = useAtomValue(fileSecurityScanFilePageAtom);

  const { data } = useGetFileSecurityScanFiles({
    page,
    size: LIST_PAGE_SIZE,
    scanId: Number(id),
  });

  return (
    <MySearchFilter
      title="취약점 검사 파일 목록"
      total={data?.totalSize}
    ></MySearchFilter>
  );
}
