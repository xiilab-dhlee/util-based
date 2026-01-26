"use client";

import { useAtom } from "jotai";

import { nodePageAtom } from "@/domain/node/state/node.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface NodeListFooterProps {
  /** 전체 노드 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 노드 목록 페이지 하단 푸터 컴포넌트
 *
 * 노드 목록 페이지에서 페이지 번호를 관리하고,
 * 총 노드 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param total - 전체 노드 수
 * @param loading - 로딩 상태
 * @returns 노드 목록 페이지 하단 푸터 컴포넌트
 */
export function NodeListFooter({ total, loading }: NodeListFooterProps) {
  const [page, setPage] = useAtom(nodePageAtom);

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
