"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import type { WorkloadReclaimScanResultResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetScanResultList } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import {
  revokeHistoryDetailDateRangeAtom,
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailTypeAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { RevokeHistoryDetailBody } from "./revoke-history-detail-body";
import { RevokeHistoryDetailFilter } from "./revoke-history-detail-filter";
import { RevokeHistoryDetailFooter } from "./revoke-history-detail-footer";

interface RevokeHistoryDetailMainProps {
  id: string;
}

/**
 * 리소스 회수 이력 상세 페이지 메인 컴포넌트
 *
 * 경고/회수 목록의 필터, 테이블, 페이지네이션을 포함합니다.
 */
export function RevokeHistoryDetailMain({ id }: RevokeHistoryDetailMainProps) {
  const scanHistoryId = Number(id);
  const page = useAtomValue(revokeHistoryDetailPageAtom);
  const resetPage = useResetAtom(revokeHistoryDetailPageAtom);
  const resetDateRange = useResetAtom(revokeHistoryDetailDateRangeAtom);
  const resetType = useResetAtom(revokeHistoryDetailTypeAtom);

  const { data, isLoading, isError } = useGetScanResultList(
    scanHistoryId,
    {
      pageRequest: {
        pageNo: page - 1,
        pageSize: LIST_PAGE_SIZE,
      },
    },
    {
      query: { enabled: Boolean(scanHistoryId) },
    },
  );

  const content: WorkloadReclaimScanResultResponse[] = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  // 마운트 시 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트시 초기화
  useEffect(() => {
    resetPage();
    resetDateRange();
    resetType();
  }, []);

  return (
    <>
      {/* 경고/회수 목록 필터 */}
      <RevokeHistoryDetailFilter totalSize={totalSize} />
      {/* 경고/회수 목록 테이블 */}
      <RevokeHistoryDetailBody
        content={content}
        isLoading={isLoading}
        isError={isError}
      />
      {/* 페이지네이션 */}
      <RevokeHistoryDetailFooter totalSize={totalSize} isLoading={isLoading} />
    </>
  );
}
