"use client";

import { useAtom } from "jotai";

import { adminWorkloadPageAtom } from "@/domain/workspace/state/workspace.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface AdminWorkloadFooterProps {
  /** 전체 워크로드 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 관리자 워크로드 목록 페이지네이션 컴포넌트
 *
 * 워크스페이스 상세 페이지에서 워크로드 목록의 페이지를 관리합니다.
 *
 * @param total - 전체 워크로드 수
 * @param loading - 로딩 상태
 */
export function AdminWorkloadFooter({
  total,
  loading,
}: AdminWorkloadFooterProps) {
  const [page, setPage] = useAtom(adminWorkloadPageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}
    />
  );
}
