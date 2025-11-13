"use client";

import { useAtomValue } from "jotai";

import { nodePageAtom } from "@/atoms/node/node-list.atom";
import nodeListConstants from "@/constants/node/node-list.constant";
import { useGetNodes } from "@/hooks/node/use-get-nodes";
import { MySearchFilter } from "@/layouts/common/search-filter";

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
    size: nodeListConstants.pageSize,
  });

  return (
    <MySearchFilter title="노드 목록" total={data?.totalSize}>
      {/* 검색 및 정렬 기능 제거 */}
    </MySearchFilter>
  );
}

