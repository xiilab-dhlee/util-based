"use client";

import { useAtom } from "jotai";

import { useGetNodes } from "@/domain/node/hooks/use-get-nodes";
import { nodePageAtom } from "@/domain/node/state/node.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListPageFooter } from "@/shared/layouts/list/list-page-footer";

/**
 * 노드 목록 페이지 하단 푸터 컴포넌트
 *
 * 노드 목록 페이지에서 페이지 번호를 관리하고,
 * 총 노드 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 노드 목록 페이지 하단 푸터 컴포넌트
 */
export function NodeListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(nodePageAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetNodes({
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
      // 삭제 버튼 제거
    />
  );
}
