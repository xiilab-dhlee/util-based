"use client";

import { useAtom } from "jotai";

import { hubPageAtom } from "@/domain/hub/state/hub.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { CARD_PAGE_SIZE } from "@/shared/constants/core.constant";

interface HubListFooterProps {
  total: number;
  loading: boolean;
}

/**
 * 허브 목록 페이지 하단 푸터 컴포넌트
 *
 * 허브 목록 페이지에서 페이지네이션 기능을 제공하는 푸터 컴포넌트입니다.
 */
export function HubListFooter({ total, loading }: HubListFooterProps) {
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(hubPageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={CARD_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}
    />
  );
}
