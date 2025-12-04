"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { useGetFileSecurityScanFiles } from "@/domain/security/hooks/use-get-file-security-scan-files";
import { fileSecurityScanFilePageAtom } from "@/domain/security/state/file-security.atom";
import { createFileSecurityScanFileColumn } from "@/shared/components/column/create-file-security-scan-file-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 파일 시스템 보안 검사 파일 목록 본문 컴포넌트
 *
 * 검사 상세 페이지에서 검사된 파일 목록을 표시하는 테이블을 제공합니다.
 */
export function FileSecurityScanFileListBody() {
  const { id } = useParams();
  const page = useAtomValue(fileSecurityScanFilePageAtom);

  const scanId = Number(id);

  const { data, isLoading } = useGetFileSecurityScanFiles({
    page,
    size: LIST_PAGE_SIZE,
    scanId,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createFileSecurityScanFileColumn(scanId)}
        data={data?.content || []}
        columnHeight={38}
        loading={isLoading}
        activePadding
      />
    </ListWrapper>
  );
}
