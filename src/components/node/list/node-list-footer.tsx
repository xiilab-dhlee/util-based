"use client";

import { useAtom } from "jotai";

import { nodePageAtom } from "@/atoms/node/node-list.atom";
import nodeListConstants from "@/constants/node/node-list.constant";
import { useGetNodes } from "@/hooks/node/use-get-nodes";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

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
    size: nodeListConstants.pageSize,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.total || 0}
      page={page}
      pageSize={nodeListConstants.pageSize}
      onChange={handlePage}
      isLoading={isLoading}
      // 삭제 버튼 제거
    />
  );
}

