"use client";

import { useAtomValue } from "jotai";

import { useGetNodes } from "@/domain/node/hooks/use-get-nodes";
import { nodePageAtom } from "@/domain/node/state/node.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 노드 목록 페이지 상단 필터 컴포넌트
 *
 * 노드 목록 페이지에서 간단한 제목과 총 개수만 표시합니다.
 *
 * @returns 노드 목록 페이지 상단 필터 컴포넌트
 */
export function NodeListFilter() {
  const page = useAtomValue(nodePageAtom);

  const { data } = useGetNodes({
    page,
    size: LIST_PAGE_SIZE,
  });

  return (
    <MySearchFilter title="노드 목록" total={data?.totalSize}>
      {/* 검색 및 정렬 기능 제거 */}
    </MySearchFilter>
  );
}
